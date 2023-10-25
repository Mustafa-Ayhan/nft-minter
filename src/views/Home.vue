<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">

      <div class="py-14" />

      <v-container v-if="isConnectionVisible" class="d-flex align-center justify-center">

        <v-btn color="primary" @click="connectWallet" min-width="228" rel="noopener noreferrer" size="x-large"
          target="_blank" variant="flat">
          <v-icon icon="mdi-speedometer" size="large" start />
          Connect to your wallet
        </v-btn>
      </v-container>

      <v-container v-else>
        <v-row class="d-flex justify-center">
          <v-col cols="auto">
            <v-card class="mx-auto" width="800">
              <v-card-title>General Info</v-card-title>

              <v-card-text>
                <v-row align="center">
                  <v-col cols="6">
                    <v-text-field label="Name" variant="outlined"></v-text-field>
                    <v-file-input v-model="file" accept="image/*" label="Upload" @update:model-value="fileUpload($event)"
                      variant="outlined" prepend-icon="" append-inner-icon="$file"></v-file-input>
                  </v-col>

                  <v-col cols="6" class="align-center justify-center">
                    <v-img :src="imageFile" lazy-src="https://cdn.vuetifyjs.com/images/parallax/material.jpg" center-affix
                      aspect-ratio="1/1"></v-img>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

        </v-row>
        <v-row class="d-flex justify-center">
          <v-col cols="auto">
            <v-card class="mx-auto" width="800">
              <v-card-title>Price</v-card-title>

              <v-card-text>
                <v-row class="align-center justify-center">
                  <v-col cols="6" class="align-center justify-center">
                    <v-text-field v-model="amount" label="Amount" type="number" variant="outlined"
                      hide-details></v-text-field>
                  </v-col>
                  <v-col cols="6" class="align-center justify-center">
                    <v-btn text="Mint" color="indigo-darken-3" size="x-large" block @click="uploadMoralis"></v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="d-flex justify-center">
          <v-col cols="auto">
            <v-card class="mx-auto" width="800">
              <v-card-title>Balance</v-card-title>

              <v-card-text>
                <v-row class="align-center justify-center">
                  <v-col cols="6" class="align-center justify-center">
                    <v-btn text="Get Treasury Balance" color="success" size="x-large" block
                      @click="getTreasuryBalance"></v-btn>
                    {{ treasuryBalance }}
                  </v-col>
                  <v-col cols="6" class="align-center justify-center">
                    <v-btn text="Get Liquidity Balance" color="warning" size="x-large" block
                      @click="getLiquidityBalance"></v-btn>
                    {{ liquidityBalance }}
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import Moralis from 'moralis';
import { ref } from 'vue';

defineProps(["containerVisible"]);

let isConnectionVisible = ref(window.ethereum?.selectedAddress ? false : true);
let imageFile = ref("");
let file: any = ref();
let amount = ref(0);
let treasuryBalance = ref("0");
let liquidityBalance = ref("0");

async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      // Request access to the user's wallet
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Check if the user is connected
      if (window.ethereum.selectedAddress) {
        alert("Connected to wallet with address: " + window.ethereum.selectedAddress);
        isConnectionVisible.value = false;
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to the wallet. Make sure you have MetaMask installed and unlocked.");
    }
  }
  else {
    alert("MetaMask is not installed. Please install it to connect your wallet.");
  }
}

function fileUpload(fileArray: Array<any>) {
  if (!fileArray || fileArray.length == 0) { return }
  imageFile.value = URL.createObjectURL(fileArray[0]);
}

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

async function uploadMoralis() {
  getBase64(file.value[0]).then(async fileContent => {
    const fileName = file.value[0].name;
    let uploadArr = [{ path: fileName, content: <string>fileContent }];
    const fileUploadResponse = await uploadToIpfs(uploadArr);
    const cidFile = fileUploadResponse.result[0].path.split("/");
    const metadata: any = {
      name: fileName,
      image: "ipfs://" + cidFile[cidFile.length - 2]
    }

    const metadataResponse = await uploadToIpfs([{
      path: fileName.split(".")[0] + ".json",
      content: metadata
    }]);

    const cidMetadata = metadataResponse.result[0].path.split("/");
    await mintFile("ipfs://" + cidMetadata[cidMetadata.length - 2]);
  });
}

async function mintFile(uri: string) {
  const accounts = await web3js.eth.getAccounts();
  await minterContract.methods.safeMint(window.ethereum.selectedAddress, uri).send({ from: accounts[0] });
  await shareReward(accounts[0]);
}

async function shareReward(account: string) {
  let liquidityAmount = amount.value * 0.04;
  let treasuryAmount = amount.value * 0.06;
  let balance = amount.value - liquidityAmount - treasuryAmount;
  await liquidityContract.methods.deposit().send({ from: account, value: web3js.utils.toWei(liquidityAmount + "", "ether") });
  await treasuryContract.methods.deposit().send({ from: account, value: web3js.utils.toWei(treasuryAmount + "", "ether") });
}

async function uploadToIpfs(abiContent: Array<{ path: string, content: string }>) {
  return await Moralis.EvmApi.ipfs.uploadFolder({
    abi: abiContent
  })
}

async function getTreasuryBalance() {
  treasuryBalance.value = await treasuryContract.methods.getBalance().call();
}

async function getLiquidityBalance() {
  liquidityBalance.value = await liquidityContract.methods.getBalance().call();
}

</script>
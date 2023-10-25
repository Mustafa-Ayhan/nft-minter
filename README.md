## Project setup

```
# yarn
yarn

# npm
npm install

# pnpm
pnpm install

# bun
bun install
```

### Compiles and hot-reloads for development

```
# yarn
yarn dev

# npm
npm run dev

# pnpm
pnpm dev

# bun
pnpm run dev
```

### Compiles and minifies for production

```
# yarn
yarn build

# npm
npm run build

# pnpm
pnpm build

# bun
pnpm run build
```

### Cüzdan Adresleri
(Contract lar Sepolia Ağı üzerinde tanımlıdır)
- Minter = 0x27f7f7BAC0E8467Db2bCaD94100A515b1f07EA4b
- Treasury = 0xCae3706426B37361f60C9de1315f249e75647690
- Liquidity = 0x721a999d2Af0bAC7Fc0fFEb24385F25887539A5D
  Contract solidity dosyaları repodaki **contracts** klasöründe bulabilir.

### Uygulama Adımları
1. Connect Wallet butonundan tarayıcı üzerindeki tanımlı cüzdan bağlanır.
2. General Info dan yüklenecek bilgilerin değerleri girilir.
3. Amount kısmından gönderilecek miktar seçilir.
4. Mint butonuna tıklanarak girilmiş olan değerler ile mint işlemi başlatılır.
5. Cüzdana gelecek 3 transaction uyarısı kabul edilir.
( İlk onay yüklenen dosya bilgilerinin mint edilmesi
İkinci ve üçüncü onaylar ise Liquidity ve Treasury Cüzdanlarına yapılacak aktarımın onayı içindir.)
6. Mint işlemi tamamlandıktan sonra OpenSea üzerinden mint edilmiş içerik kontrol edilir.
(Dosya içeriğini göstermekle ilgili bir sorun yaşadım, bu kısımda sorunu inceleyecek daha fazla vaktim olmadı..)
7. Gönderilen miktar ise liquidity ve treasury cüzdanlarına yollanarak, bu cüzdanlar üzerindeki toplanmış miktar alt kısımdaki butonlar aracılığı ile kontrol edilebilir.
Senaryo akışının videosu için şu dosyayı kullanabilirsiniz.

### Açıklamalar
3. sorunun cevabı için:
Havuzdaki toplam token miktarı ve günde dağıtılan toplam ödül miktarı bulunur.
Günlük ödülleri toplam havuz büyüklüğüne bölerek günlük getiri oranı elde edilir.
Günlük getiri oranını 365 ile çarpılır ve APR elde edilir.

Örneğin, bir likidite havuzunda 100.000 token varsa ve günde 500 token ödül olarak dağıtılıyorsa, günlük APR şöyledir:

Günlük getiri oranı = 500 / 100.000 = 0.005
APR = 0.005 x 365 = 1.825

Kayıp yaşanmadan bu hesaplanmaların yapılabilmesi içinde yazılacak olan hesaplama fonksiyonlarının Solidity üzerinde **view** keyword ü ile yazılması gerekmektedir. Böylece hesaplama işlemlerinde gas ücreti harcanmaz. 

# Kelime Zinciri

English version below.

İki kişiyle oynanan basit bir Türkçe kelime zinciri oyunu. Sırayla kelime yazarsınız; her yeni kelime, önceki kelimenin son harfiyle başlamalıdır.

## Özellikler

- Klasik ve zamanlı oyun modu
- Oyuncu isimleri
- Oyuncu başına özel tur sayısı
- Türkçe karakter eşleştirme desteği
- Kullanılan kelimelerin geçmişi
- Kelime başına puan gösterimi
- Fiil mastar eki puan dışı bırakılır
- Eşit skor her zaman beraberlik sayılır

## Nasıl Oynanır?

1. Oyun modunu seçin: `Klasik` veya `Zamanlı`.
2. Her oyuncunun kaç kere oynayacağını yazın.
3. Zamanlı modu seçtiyseniz süre limitini belirleyin.
4. Oyuncu isimlerini girin.
5. Oyun size bir harf verir. O harfle başlayan bir kelime yazın.
6. Sıradaki oyuncu, sizin kelimenizin son harfiyle başlayan yeni bir kelime yazar.

## Puanlama

- Her doğru kelime, harf sayısı kadar puan verir.
- Mastar eki `-mak` ve `-mek` puana dahil değildir.
- Örnek: `yazmak` kelimesi 6 harftir ama 3 puan verir.
- Skorlar eşitse oyun berabere biter.

## Yerelde Çalıştırma

Bu oyun sadece HTML, CSS ve JavaScript ile çalışır. Bir şey kurmanız gerekmez.

Oyunu oynamak için:

1. Bu projedeki dosyaları bilgisayarınıza indirin.
2. Dosyaları aynı klasörde tutun.
3. `index.html` dosyasını Chrome, Edge, Firefox veya Safari gibi bir tarayıcıda açın.

GitHub kullanmıyorsanız da sorun değil. Klasörü indirip `index.html` dosyasına çift tıklamanız yeterli.

## Dosyalar

- `index.html`: Oyun arayüzü
- `style.css`: Görsel tasarım
- `script.js`: Oyun mantığı
- `turkish-words.js`: Türkçe kelime sözlüğü
- `turkce_kelime_listesi.txt`: Kaynak kelime listesi
- `tools/generate_wordlist.py`: Kelime listesini JavaScript sözlüğüne çeviren yardımcı script

## Kaynak

Türkçe kelime listesi: https://github.com/CanNuhlar/Turkce-Kelime-Listesi

## Lisans

Oyunun kendi kodu MIT Lisansı ile paylaşılmıştır. Detaylar için `LICENSE` dosyasına bakabilirsiniz.

Türkçe kelime listesi yukarıdaki kaynaktan alınmıştır. Bu kaynak depoda şu anda açık bir lisans belirtilmemiştir. Bu yüzden MIT Lisansı, `turkce_kelime_listesi.txt` dosyasını ve ondan üretilen `turkish-words.js` dosyasını kapsamaz.

---

# Kelime Zinciri - English

A simple Turkish word-chain game for two players. Players take turns writing words; each new word must start with the last letter of the previous word.

## Features

- Classic and timed game modes
- Player names
- Custom number of turns per player
- Turkish character matching
- Word history
- Points shown next to each word
- Turkish verb infinitive endings do not count toward points
- Equal scores always end in a draw

## How to Play

1. Choose a game mode: `Klasik` or `Zamanlı`.
2. Enter how many times each player will play.
3. If you choose timed mode, set the time limit.
4. Enter the player names.
5. The game gives you a letter. Write a word that starts with that letter.
6. The next player writes a new word that starts with the last letter of your word.

## Scoring

- Each correct word gives points based on its letter count.
- The infinitive endings `-mak` and `-mek` are not included in the score.
- Example: `yazmak` has 6 letters, but gives 3 points.
- If the scores are equal, the game ends in a draw.

## Running Locally

This game only uses HTML, CSS, and JavaScript. You do not need to install anything.

To play:

1. Download the project files to your computer.
2. Keep all files in the same folder.
3. Open `index.html` in a browser like Chrome, Edge, Firefox, or Safari.

You do not need to use GitHub. Downloading the folder and double-clicking `index.html` is enough.

## Files

- `index.html`: Game interface
- `style.css`: Visual design
- `script.js`: Game logic
- `turkish-words.js`: Turkish word dictionary
- `turkce_kelime_listesi.txt`: Source word list
- `tools/generate_wordlist.py`: Helper script that turns the word list into a JavaScript dictionary

## Source

Turkish word list: https://github.com/CanNuhlar/Turkce-Kelime-Listesi

## License

The original game code is shared under the MIT License. See `LICENSE` for details.

The Turkish word list comes from the source above. That source repository does not currently include a license. Because of that, this project's MIT License does not apply to `turkce_kelime_listesi.txt` or the generated `turkish-words.js` file.

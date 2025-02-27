import fs from "fs";
import path from "path";

const AUDIO_FOLDER = path.join(process.cwd(), "public");

// 👉 Функция удаления всех старых аудиофайлов
export function clearOldAudioFiles() {
    fs.readdir(AUDIO_FOLDER, (err, files) => {
      if (err) {
        console.error("Error reading audio folder:", err);
        return;
      }
  
      files.forEach((file) => {
        if (file.startsWith("speech_") && file.endsWith(".mp3")) {
          fs.unlink(path.join(AUDIO_FOLDER, file), (err) => {
            if (err) console.error("Error deleting file:", file, err);
          });
        }
      });
    });
  }

  export const jokeLanguages = ["Shyriiwook, Wookie Language, from Star Wars", "Quenya, Elvish Language from The Lord of the Rings", "Dothraki, from Game of Thrones"];
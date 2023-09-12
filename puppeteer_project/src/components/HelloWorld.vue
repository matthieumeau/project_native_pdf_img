<template>
  <div class="d-flex justify-center flex-column">
    <div>
      <input
        type="radio"
        id="pdf"
        name="convertType"
        value="pdf"
        @click="selectedState = 'PDF'"
        checked
      />
      <label for="pdf">pdf</label>
    </div>

    <div>
      <input
        type="radio"
        id="img"
        name="convertType"
        value="img"
        @click="selectedState = 'IMG'"
      />
      <label for="img">img</label>
    </div>
  </div>
  <div class="d-flex flex-column">
    <div class="d-flex">
      <span>Par url : </span
      ><input
        type="text"
        class="inputText"
        v-model="text"
        @change="handleGenerateImageByUrl"
      />{{ text }}
    </div>
    <div>
      <div class="d-flex">
        <span>Par fichier : </span>
        <input type="file" class="inputFile" @change="uploadFile" />
      </div>
    </div>
  </div>
  <div class="d-flex flex-column">
    <button
      v-if="selectedState === 'PDF'"
      type="button"
      @click="handleConvertToPdf"
    >
      Convert to pdf
    </button>
    <button v-else type="button" @click="handleConvertToImg">
      Convert to img
    </button>
    <img v-if="imgUrl" :src="imgUrl" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

defineProps({
  msg: String,
});

const text = ref("");
const selectedState = ref("PDF");
const selectedFile = ref(null);
const imgUrl = ref(null);

const isValidUrl = (urlString) => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

function handleConvertToPdf() {
  if (selectedFile.value) {
    const formData = new FormData();
    formData.append("htmlFile", selectedFile.value);
    axios
      .post("http://localhost:3000/generate-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      })
      .then((response) => {
        console.log("Réponse reçue:", response.data);

        // 1. Créer l'URL à partir du blob
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // 2. Créer un élément d'ancre et définir ses attributs
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "output.pdf"); // Vous pouvez renommer 'output.pdf' si vous le souhaitez

        // Simuler un clic pour déclencher le téléchargement
        document.body.appendChild(link);
        link.click();

        // Supprimer l'élément d'ancre après le téléchargement
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi du fichier:", error);
      });
  }
  if (text.value) {
    handleUrl();
  }
}
function handleConvertToImg() {
  if (selectedFile.value) {
    const formData = new FormData();
    formData.append("htmlFile", selectedFile.value);
    axios
      .post("http://localhost:3000/generate-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      })
      .then((response) => {
        console.log("Réponse reçue:", response.data);

        // 1. Créer l'URL à partir du blob
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // 2. Créer un élément d'ancre et définir ses attributs
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "output.png"); // Vous pouvez renommer 'output.pdf' si vous le souhaitez

        // Simuler un clic pour déclencher le téléchargement
        document.body.appendChild(link);
        link.click();

        // Supprimer l'élément d'ancre après le téléchargement
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi du fichier:", error);
      });
  }
  if (text.value) {
    handleUrl();
  }
}

function handleGenerateImageByUrl() {
  if (selectedFile.value) {
    selectedFile.value = null;
  }
  if (isValidUrl(text.value)) {
    if (
      !text.value.startsWith("http://") &&
      !text.value.startsWith("https://")
    ) {
      text.value = "http://" + text.value;
    }
    const formData = {
      url: text.value,
    };
    axios
      .post("http://localhost:3000/generate-image-from-url", formData, {
        responseType: "blob",
      })
      .then((response) => {
        console.log("Réponse reçue:", response.data);

        const url = window.URL.createObjectURL(new Blob([response.data]));

        // 2. Créer un élément d'ancre et définir ses attributs
        imgUrl.value = url;
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi du fichier:", error);
      });
  }
}

function handleGenerateImageByFile() {
  if (selectedFile.value) {
    const formData = new FormData();
    formData.append("htmlFile", selectedFile.value);
    axios
      .post("http://localhost:3000/generate-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      })
      .then((response) => {
        console.log("Réponse reçue:", response.data);

        // 1. Créer l'URL à partir du blob
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // 2. Créer un élément d'ancre et définir ses attributs
        imgUrl.value = url;
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi du fichier:", error);
      });
  }
}

function handleUrl() {
  if (isValidUrl(text.value)) {
    if (
      !text.value.startsWith("http://") &&
      !text.value.startsWith("https://")
    ) {
      text.value = "http://" + text.value;
    }
    const formData = {
      url: text.value,
    };
    axios
      .post("http://localhost:3000/generate-image-from-url", formData, {
        responseType: "blob",
      })
      .then((response) => {
        console.log("Réponse reçue:", response.data);

        // 1. Créer l'URL à partir du blob
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // 2. Créer un élément d'ancre et définir ses attributs
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "output.png"); // Vous pouvez renommer 'output.pdf' si vous le souhaitez

        // Simuler un clic pour déclencher le téléchargement
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi du fichier:", error);
      });
  }
}

function uploadFile(event) {
  selectedFile.value = event.target.files[0];
  imgUrl.value = "";
  text.value = "";
  handleGenerateImageByFile();
}
</script>

<style scoped>
.read-the-docs {
  color: #888;
}

.d-flex {
  display: flex;
}
.flex-column {
  flex-direction: column;
}

.flex-row {
  flex-direction: row;
}
.justify-center {
  justify-content: center;
}
</style>

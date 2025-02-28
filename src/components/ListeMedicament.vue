<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import MedicamentItem from "./MedicamentItem.vue";
import MedicamentForm from "./MedicamentForm.vue";
import Medicament from "../Medicament.js";
import debounce from "lodash.debounce";// Import de debounce (https://codecourse.com/articles/debounce-input-in-vue-3)

const listeMedicaments = reactive([]); // Stocke les médicaments
const medicamentSelectionne = ref({
  id: null,
  denomination: "",
  qte: 0,
  formepharmaceutique: "",
  photo: null
}); // Stocke le médicament en cours d'édition

// -- l'url de l'API
const url = " https://apipharmacie.pecatte.fr/api/28/medicaments";

// ========   BARRE DE RECHERCHE  ===============
// -- Champ de recherche
const searchQuery = ref("");

// Debounce pour éviter les requêtes excessives
const debouncedSearch = ref("");

watch(searchQuery, debounce((newVal) => {
  debouncedSearch.value = newVal;
}, 300)); // Attente de 300ms avant d'appliquer la recherche

// Filtrage des médicaments
const filteredMedicaments = computed(() => {
  // Vérifier que debouncedSearch est une chaîne de caractères
  const searchTerm = debouncedSearch.value ? debouncedSearch.value.toLowerCase() : "";
  
  return listeMedicaments.filter(med =>{
    if (typeof med.denomination === 'string') {
      return med.denomination.toLowerCase().includes(searchTerm);
    }
    return false;
    });
});

// ========   GET  ===============
//    req AJAX pour récupérer la liste des médicaments
//    et les stocker dans listeMedicaments
function getMedicaments() {
  console.log("📡 Début de getMedicaments()");
  const fetchOptions = { method: "GET" };
  fetch(url, fetchOptions)
    .then((response) => {
      return response.json();
    })
    .then((dataJSON) => {
      console.log("Médicaments reçus :", dataJSON);
      // -- vider la liste avant d'ajouter les nouveaux médicaments
      listeMedicaments.splice(0, listeMedicaments.length);


      // -- Ajouter chaque médicament reçu dans la liste
      dataJSON.forEach((m) =>
        listeMedicaments.push(new Medicament(
          m.id, 
          m.denomination, 
          m.qte,
          m.formepharmaceutique,
          m.photo)));
    })
    .catch((error) => console.log("Erreur GET:", error));
}

// Exécuter la récupération des médicaments
onMounted(() => {
  getMedicaments();
});


// ========   POST : Ajouter un Médicament  ===============

function handlerAdd(medicament) {

  console.log("Ajout du médicament :", medicament);

  if (!medicament || !medicament.denomination || !medicament.qte || !medicament.formepharmaceutique || !medicament.photo) {
    console.error("Erreur : données incomplètes !");
    return;
  }
  
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  console.log("Envoi du POST avec :", medicament);

  const fetchOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(medicament),
  };

  console.log("🛜 Envoi de la requête à l'API...");

  fetch(url, fetchOptions)
    .then((response)=> {
    if (!response.ok) {
      throw new Error(`Erreur API : ${response.status} ${response.statusText}`);
    }
    return response.json();
  })
  .then((dataJSON) =>  {
    console.log("Médicament ajouté :", dataJSON);
    getMedicaments();
  })
  .catch((error) =>  console.error("Erreur POST :", error));
}


// ========   PUT : Modifier un Médicament  ===============
function handlerUpdate(medicament) {
  console.log("✏️ Mise à jour du médicament :", medicament);

  if (!medicament.id) {
    console.error("Erreur: L'ID du médicament est manquant !");
    return;
  }

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");


  const fetchOptions = {
    method: "PUT",
    headers: myHeaders,
    body: JSON.stringify(medicament),
  };

  console.log("Médicament envoyé au PUT :", medicament);

  fetch(url, fetchOptions)
    .then((response) => response.json())
    .then((dataJSON) => {
      console.log("Médicament mis à jour :", dataJSON);
      getMedicaments(); // Rafraîchir la liste
    })
    .catch((error) =>  console.log("Erreur PUT :", error));
}

// Gérer la modification : remplir le formulaire 
function handlerEdit(medicament) {
  console.log("📋 handlerEdit - Médicament sélectionné :", medicament);

  // Mise à jour correcte de l'objet réactif
  medicamentSelectionne.value = { 
    id: medicament.id, 
    denomination: medicament.denomination, 
    qte: medicament.qte, 
    formepharmaceutique: medicament.formepharmaceutique,
    photo: medicament.photo
  };
  
  console.log("✅ Après handlerEdit :", medicamentSelectionne);
}


//Mettre à jour la quantité d'un médicament
function updateQuantity(medicament, newQuantite) {
  console.log(`🔄 Mise à jour de la quantité de ${medicament.denomination} : ${newQuantite}`);

  if (newQuantite < 0) {
    console.error("Impossible d'avoir une quantité négative !");
    return;
  }

  const updatedMedicament = {
    id: medicament.id,
    denomination: medicament.denomination,
    qte: newQuantite,
    formepharmaceutique: medicament.formepharmaceutique,
  };

  // Ajouter la photo seulement si elle a changé
  if (medicament.photo !== listeMedicaments.find(m => m.id === medicament.id)?.photo) {
  updatedMedicament.photo = medicament.photo;
  }

  const fetchOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedMedicament) 
  };

  console.log("📸 Image envoyée dans le PUT :", updatedMedicament.photo);

  fetch(url, fetchOptions)
    .then(response => response.json())
    .then(dataJSON => {
      console.log("✅ Quantité mise à jour :", dataJSON);

      // 🔄 Mise à jour immédiate dans l'interface
      const medicamentIndex = listeMedicaments.findIndex(m => m.id === medicament.id);
      if (medicamentIndex !== -1) {
        listeMedicaments[medicamentIndex].qte = newQuantite;
      }

      getMedicaments(); //Rafraîchir la liste après mise à jour
    })
    .catch(error => console.log("❌ Erreur PUT :", error));

}

// -- Livraison (Ajouter 1)
function handlerLivrer(medicament) {
  console.log("📦 Livraison pour :", medicament.denomination);
  console.log("🔍 Vérification de l'image avant envoi :", medicament.photo);

  updateQuantity(medicament, medicament.qte + 1);
}

// -- Dispensation (Retirer 1)
function handlerDispenser(medicament) {
  if (medicament.qte >  0) {
    console.log("💊 Dispensation pour :", medicament.denomination);
    updateQuantity(medicament, medicament.qte - 1);
  } else {
    console.warn("⚠️ Impossible de dispenser : Stock épuisé !");
  }
}

// ========   DELETE : Supprimer un Médicament  ===============
function handlerDelete(id) {
  console.log("Suppression ID :", id);

  const fetchOptions = { method: "DELETE" };

  fetch(url + "/" + id, fetchOptions)
    .then((response) => response.json())
    .then((dataJSON) => {
      console.log("Médicament supprimé :", dataJSON);
      getMedicaments(); // Rafraîchir la liste
    })
    .catch((error) => console.log("Erreur DELETE :", error));
}

</script>

<template>
  <h3>Liste des Médicaments</h3>

  <div>
    <!-- Barre de recherche -->
    <input 
      v-model="searchQuery" 
      placeholder="Rechercher un médicament..." 
    />

    <!-- Liste filtrée -->
    <ul>
      <MedicamentItem
        v-for="medicament in filteredMedicaments"
        :key="medicament.id"
        :medicament="medicament"
        :searchQuery="debouncedSearch"
        @eventDelete="handlerDelete"
        @eventEdit="handlerEdit"
        @eventUpdate="handlerUpdate"
        @eventLivrer="handlerLivrer"
        @eventDispenser="handlerDispenser"
      />
    </ul>
  </div>



  <MedicamentForm 
  :medicament="medicamentSelectionne"
  @addMedicament="handlerAdd" 
  @updateMedicament="handlerUpdate" 
  />


</template>


<style scoped>
</style>
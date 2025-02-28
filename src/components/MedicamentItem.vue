<script setup>
defineProps([
  "medicament",
  "searchQuery"]);


//Émettre des événements vers le parent
const emit = defineEmits(["eventDelete", "eventEdit", "eventLivrer", "eventDispenser"]);


// ========  SURLIGNAGE DU TEXTE CORRESPONDANT À LA RECHERCHE ===============
const highlightText = (text, query) => {
  // Si la recherche est vide, retourner le texte normal
  if (!text || !query) {
    return text;
  }
  console.log("Texte original :", text); // Afficher le texte original

  // Créer une expression régulière pour trouver les termes correspondant à la recherche
  const regex = new RegExp(`(${query})`, "gi"); // "g" pour global et "i" pour insensible à la casse

  const highlightedText = text.replace(regex, `<span class="highlight">$1</span>`); // Remplacer le texte trouvé par du HTML

  console.log("Texte après surlignage :", highlightedText); // Afficher le texte après surlignage


  return highlightedText;
};

</script>

<template>
    <li>
      <strong v-html="highlightText(medicament.denomination, searchQuery)"></strong>
      ({{ medicament.formepharmaceutique }})
      {{ medicament.qte }} unités 

      <!-- Affichage de l'image si elle existe -->
    <div v-if="medicament.photo">
      <img :src="medicament.photo.startsWith('data:image') ? medicament.photo : 'https://apipharmacie.pecatte.fr/images/' + medicament.photo"  
      alt="Image du médicament" width="100" />
    </div>

      <button @click="emit('eventEdit', medicament)">✏️ Modifier</button>
      <button @click="emit('eventDelete', medicament.id)">🗑 Supprimer</button>
      <button @click="$emit('eventLivrer', medicament)">📦 Livrer</button>
      <button @click="$emit('eventDispenser', medicament)" :disabled="medicament.qte <= 0">💊 Dispenser</button>
  </li>
</template>
  
  <style>
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
  }
  button {
    margin: 5px;
  }
  .highlight {
  background-color: rgb(252, 244, 96) !important;
  font-weight: regular;
  padding: 0 4px; 
  }
  </style>
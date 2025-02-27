<script setup>
defineProps(["medicament"]);

//Émettre des événements vers le parent
const emit = defineEmits(["eventDelete", "eventEdit", "eventLivrer", "eventDispenser"]);
</script>

<template>
    <li>
      <strong>{{ medicament.denomination }}</strong>
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
  
  <style scoped>
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
  }
  button {
    margin: 5px;
  }
  </style>
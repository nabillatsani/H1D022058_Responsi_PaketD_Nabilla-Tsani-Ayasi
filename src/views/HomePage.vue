<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar class="header-toolbar">
        <ion-title>Pahlawan Kekaisaran (Mulan)</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="background-content">
      <!-- Gambar sebelum daftar kisah -->
      <div class="image-container">
        <img src="/images/mulan.jpg" alt="Image Description" class="image-banner" />
      </div>

      <!-- Komponen paling atas -->
      <ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- Daftar Kisah -->
      <div class="scrollable-container">
        <ion-list>
          <ion-item-sliding v-for="kisah in kisahs" :key="kisah.id" :ref="(el) => setItemRef(el, kisah.id!)">
            <ion-item-options side="start" @ionSwipe="handleDelete(kisah)">
              <ion-item-option color="danger" expandable @click="handleDelete(kisah)">
                <ion-icon slot="icon-only" :icon="trash" size="large"></ion-icon>
              </ion-item-option>
            </ion-item-options>

            <ion-item>
              <ion-card class="full-width-card card-style">
                <ion-card-header>
                  <ion-card-title class="ion-text-wrap limited-text">{{ kisah.nama }}</ion-card-title>
                  <ion-card-subtitle class="limited-text">{{ kisah.kisah }}</ion-card-subtitle>
                </ion-card-header>

                <ion-card-content>
                  <ion-badge>{{ getRelativeTime(kisah.updatedAt) }}</ion-badge>
                </ion-card-content>
              </ion-card>
            </ion-item>

            <ion-item-options side="end">
              <ion-item-option @click="handleEdit(kisah)">
                <ion-icon slot="icon-only" :icon="create" size="large" class="edit-icon"></ion-icon>
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
          <ion-item v-if="kisahs.length === 0" class="ion-text-center">
            <ion-label>No kisah found</ion-label>
          </ion-item>
        </ion-list>
      </div>

      <!-- Tombol tambah -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="isOpen = true;">
          <ion-icon :icon="add" size="large"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <InputModal v-model:isOpen="isOpen" v-model:editingId="editingId" :kisah="kisah" @submit="handleSubmit" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonFab,
  IonFabButton,
  IonLabel,
  IonList,
  loadingController,
  toastController,
  IonRefresher,
  IonRefresherContent
} from '@ionic/vue';

import { add, create, trash, checkmarkCircle, closeCircle, warningOutline } from 'ionicons/icons';
import InputModal from '@/components/InputModal.vue';
import { ref, computed, onMounted } from 'vue';
import { firestoreService, Kisah } from '@/utils/firestore';
import { formatDistanceToNow } from 'date-fns';

// Variabel dan fungsi
const isOpen = ref(false);
const editingId = ref<string | null>(null);
const kisahs = ref<Kisah[]>([]);
const kisah = ref<Omit<Kisah, 'id'>>({
  nama: '',
  kisah: '',
});

const itemRefs = ref<Map<string, HTMLIonItemSlidingElement>>(new Map());

const setItemRef = (el: any, id: string) => {
  if (el) {
    itemRefs.value.set(id, el.$el);
  }
};

const showToast = async (message: string, color: string = 'success', icon: string = checkmarkCircle) => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    color,
    position: 'top',
    icon,
  });
  await toast.present();
};

const getRelativeTime = (date: any) => {
  try {
    const jsDate = date?.toDate ? date.toDate() : new Date(date);
    return formatDistanceToNow(jsDate, { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
};

const loadKisah = async () => {
  try {
    kisahs.value = await firestoreService.getKisah();
    // Urutkan kisah berdasarkan updatedAt (atau field lain sesuai kebutuhan)
    kisahs.value.sort((a, b) => b.updatedAt?.toDate().getTime() - a.updatedAt?.toDate().getTime());
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  loadKisah();
});

const handleRefresh = async (event: any) => {
  try {
    await loadKisah();
  } catch (error) {
    console.error('Error refreshing:', error);
  } finally {
    event.target.complete();
  }
};

const handleSubmit = async (kisahData: Omit<Kisah, 'id'>) => {
  if (!kisahData.nama) {
    await showToast('Nama is required', 'warning', warningOutline);
    return;
  }
  try {
    if (editingId.value) {
      await firestoreService.updateKisah(editingId.value, kisahData);
      await showToast('Kisah updated successfully', 'success', checkmarkCircle);
    } else {
      // Menambahkan kisah baru ke akhir array kisahs
      await firestoreService.addKisah(kisahData);
      kisahs.value.push({ ...kisahData, id: 'newId' }); // Tambahkan objek kisah baru di akhir array
      await showToast('Kisah added successfully', 'success', checkmarkCircle);
    }
    loadKisah();
  } catch (error) {
    await showToast('An error occurred', 'danger', closeCircle);
    console.error(error);
  } finally {
    editingId.value = null;
  }
};

const handleEdit = async (editKisah: Kisah) => {
  editingId.value = editKisah.id!;
  kisah.value = { nama: editKisah.nama, kisah: editKisah.kisah };
  isOpen.value = true;
};

const handleDelete = async (deleteKisah: Kisah) => {
  try {
    await firestoreService.deleteKisah(deleteKisah.id!);
    await showToast('Kisah deleted successfully', 'success', checkmarkCircle);
    loadKisah();
  } catch (error) {
    await showToast('Failed to delete kisah', 'danger', closeCircle);
    console.error(error);
  }
};
</script>

<style scoped>
/* Tema warna putih dan merah maroon */
.background-content {
  background-color: #ffffff; /* Background putih */
}

.header-toolbar {
  background-color: #800000; /* Merah maroon untuk header */
}

.card-style {
  background-color: #ffffff; /* Card background putih */
  border: 1px solid #800000; /* Border merah maroon untuk card */
  margin-bottom: 16px; /* Jarak antar card */
}

.full-width-card {
  width: 100%;
  max-width: 100%;
  margin: 0;
}

.scrollable-container {
  padding: 0;
}

.limited-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

ion-card-title,
ion-card-subtitle {
  color: #800000; /* Merah maroon untuk teks judul dan subtitle */
}

ion-badge {
  background-color: #800000; /* Badge merah maroon */
  color: #ffffff; /* Teks badge putih */
}

ion-item-option {
  --color: #800000; /* Warna merah maroon untuk tombol opsi */
}

ion-fab-button {
  --background: #800000; /* Tombol tambah merah maroon */
}

ion-fab-button ion-icon {
  color: white; /* Ikon pada tombol tambah berwarna putih */
}

.image-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.image-banner {
  width: 100%;
  height: auto;
  border-radius: 8px; /* Untuk membuat gambar sedikit melengkung di tepinya */
}

/* Warna putih untuk ikon edit */
.edit-icon {
  color: white;
}
</style>

<template>
    <ion-modal :is-open="isOpen" @did-dismiss="cancel">
        <ion-header>
            <ion-toolbar>
                <ion-title>{{ editingId ? 'Edit' : 'Add' }} Kisah</ion-title>
                <ion-buttons slot="start">
                    <ion-button @click="cancel"><ion-icon :icon="close"></ion-icon></ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="modal-content">
            <!-- Card untuk form input -->
            <ion-card class="form-card">
                <ion-card-content>
                    <!-- Input untuk Nama -->
                    <ion-item>
                        <ion-input 
                            v-model="kisah.nama" 
                            label="Nama" 
                            label-placement="floating" 
                            placeholder="Masukkan Nama"
                            required>
                        </ion-input>
                    </ion-item>

                    <!-- Input untuk Kisah -->
                    <ion-item>
                        <ion-textarea 
                            v-model="kisah.kisah" 
                            label="Kisah" 
                            label-placement="floating" 
                            placeholder="Masukkan Kisah"
                            :autogrow="true" 
                            :rows="3"
                            required>
                        </ion-textarea>
                    </ion-item>

                    <!-- Tombol Simpan -->
                    <ion-row>
                        <ion-col>
                            <ion-button 
                                type="button" 
                                @click="input" 
                                class="submit-button" 
                                shape="round" 
                                expand="block"
                                style="background-color: #800000; color: white;"> <!-- Inline style -->
                                {{ editingId ? 'Edit' : 'Tambah' }} Kisah
                            </ion-button>
                        </ion-col>
                    </ion-row>
                </ion-card-content>
            </ion-card>
        </ion-content>
    </ion-modal>
</template>

<script setup lang="ts">
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonInput,
    IonRow,
    IonCol,
    IonItem,
    IonContent,
    IonTextarea,
    IonCard,
    IonCardContent
} from '@ionic/vue';
import { close } from 'ionicons/icons';
import { Kisah } from '@/utils/firestore';

// Props
const props = defineProps<{
    isOpen: boolean;
    editingId: string | null;
    kisah: Omit<Kisah, 'id'>;
}>();

// Emit
const emit = defineEmits<{
    'update:isOpen': [value: boolean];
    'update:editingId': [value: string | null];
    'submit': [item: Omit<Kisah, 'id'>];
}>();

// Cancel input
const cancel = () => {
    emit('update:isOpen', false);
    emit('update:editingId', null);
    props.kisah.nama = '';
    props.kisah.kisah = '';
};

// Submit input
const input = () => {
    if (!props.kisah.nama || !props.kisah.kisah) {
        alert('Nama dan Kisah wajib diisi!');
        return;
    }
    emit('submit', props.kisah);
    cancel();
};
</script>

<style scoped>
/* Style untuk modal */
.modal-content {
    display: flex;
    justify-content: center; /* Posisi horizontal di tengah */
    align-items: center; /* Posisi vertikal di tengah */
    height: 100%;
}

/* Card untuk formulir */
.form-card {
    width: 90%;
    max-width: 500px; /* Maksimal lebar card */
    margin: 0 auto; /* Pusatkan card secara horizontal */
}

/* Styling input dan textarea */
ion-item {
    --background: #f9f9f9;
    --border-color: #ccc;
    margin-bottom: 15px;
}

ion-input, ion-textarea {
    font-size: 16px;
    --color: #333;
}

/* Tombol Simpan berwarna merah maroon */
.submit-button {
    background-color: #800000 !important; /* Merah maroon */
    color: white !important;
    margin-top: 20px;
    font-size: 16px;
    border-radius: 50px;
}
</style>

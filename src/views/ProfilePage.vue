<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title>Profile</ion-title>

                <!-- Logout Button -->
                <ion-button slot="end" fill="clear" @click="logout" style="--color: gray;">
                    <ion-icon slot="start" :icon="exit"></ion-icon>
                    <ion-label>Logout</ion-label>
                </ion-button>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true" class="profile-background">
            <!-- Avatar -->
            <div id="avatar-container">
                <ion-avatar class="profile-avatar">
                    <img alt="Avatar" :src="userPhoto" @error="handleImageError" />
                </ion-avatar>
                <ion-text class="user-name">
                    <h2>{{ user?.displayName || 'User Name' }}</h2>
                </ion-text>
            </div>

            <!-- Data Profile -->
            <ion-card class="profile-card">
                <ion-list>
                    <ion-item>
                        <ion-label position="stacked">Name</ion-label>
                        <ion-input :value="user?.displayName || 'Not Available'" :readonly="true"></ion-input>
                    </ion-item>

                    <ion-item>
                        <ion-label position="stacked">Email</ion-label>
                        <ion-input :value="user?.email || 'Not Available'" :readonly="true"></ion-input>
                    </ion-item>
                </ion-list>
            </ion-card>

            <!-- Tabs Menu -->
            <TabsMenu />
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonItem, IonList, IonLabel, IonIcon, IonButton, IonAvatar, IonCard, IonText } from '@ionic/vue';
import { exit } from 'ionicons/icons';
import { computed, ref } from 'vue';
import TabsMenu from '@/components/TabsMenu.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const logout = () => {
    authStore.logout();
};

const userPhoto = ref(user.value?.photoURL || 'https://ionicframework.com/docs/img/demos/avatar.svg');

function handleImageError() {
    userPhoto.value = 'https://ionicframework.com/docs/img/demos/avatar.svg';
}
</script>

<style scoped>
/* Background Styling */
.profile-background {
    --background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

/* Avatar Styling */
#avatar-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: 30px 0;
    gap: 10px;
}

.profile-avatar {
    width: 100px;
    height: 100px;
    border: 3px solid #f1f1f1;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    overflow: hidden;
}

/* User Name */
.user-name h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
    font-weight: bold;
}

/* Card Styling */
.profile-card {
    width: 100%;
    max-width: 400px;
    margin: 20px auto;
    padding: 20px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Ion List Styling */
ion-label {
    color: #555;
}

ion-input {
    --color: #333;
}
</style>

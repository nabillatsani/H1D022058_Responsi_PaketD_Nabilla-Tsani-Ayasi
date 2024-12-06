// src/utils/firestore.ts
import { auth, db } from "./firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp
} from 'firebase/firestore';

// Interface data
export interface Kisah {
    id?: string;
    nama: string;        // Kolom nama
    kisah: string;       // Kolom kisah
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// Operasi CRUD
export const firestoreService = {
    // Mendapatkan referensi koleksi
    getKisahRef() {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error('User not authenticated');
        return collection(db, 'users', uid, 'kisah');
    },

    // Create
    async addKisah(kisah: Omit<Kisah, 'id'>) {
        try {
            const kisahRef = this.getKisahRef();
            const docRef = await addDoc(kisahRef, {
                ...kisah,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error Tambah Kisah:', error);
            throw error;
        }
    },

    // Read
    async getKisah(): Promise<Kisah[]> {
        try {
            const kisahRef = this.getKisahRef();
            const q = query(kisahRef, orderBy('updatedAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            } as Kisah));
        } catch (error) {
            console.error('Error Get Kisah:', error);
            throw error;
        }
    },

    // Update
    async updateKisah(id: string, kisah: Partial<Kisah>) {
        try {
            const kisahRef = this.getKisahRef();
            const docRef = doc(kisahRef, id);
            await updateDoc(docRef, {
                ...kisah,
                updatedAt: Timestamp.now()
            });
        } catch (error) {
            console.error('Error Update Kisah:', error);
            throw error;
        }
    },

    // Delete
    async deleteKisah(id: string) {
        try {
            const kisahRef = this.getKisahRef();
            const docRef = doc(kisahRef, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error Delete Kisah:', error);
            throw error;
        }
    }
};

import { auth, db } from "@/services/firebase";

export async function getCampuses(school) {
    const snapshot = await  db.collection('School').doc(school).collection("Campuses").get()
    return snapshot.docs.map(doc => doc.id);
}

export async function getOffices(school) {
    const snapshot = await  db.collection('School').doc(school).collection("Offices").get()
    return snapshot.docs.map(doc => doc.id);
}
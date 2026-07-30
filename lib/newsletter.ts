import "server-only";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getFirebaseFirestore } from "@/lib/firebase-admin";

export type NewsletterStatus = "subscribed" | "unsubscribed";

export type NewsletterSubscriber = {
  id: string;
  name: string;
  email: string;
  subscribedAt: string;
  status: NewsletterStatus;
  unsubscribeToken: string;
};

const subscribersFilePath = path.join(process.cwd(), "data", "newsletter-signups.json");
const subscribersCollection = "newsletter-subscribers";

async function getLocalSubscribers() {
  try {
    return JSON.parse(await readFile(subscribersFilePath, "utf8")) as NewsletterSubscriber[];
  } catch {
    return [];
  }
}

async function writeLocalSubscribers(subscribers: NewsletterSubscriber[]) {
  await mkdir(path.dirname(subscribersFilePath), { recursive: true });
  await writeFile(subscribersFilePath, JSON.stringify(subscribers, null, 2));
}

export async function getNewsletterSubscribers() {
  const firestore = getFirebaseFirestore();
  if (firestore) {
    const snapshot = await firestore.collection(subscribersCollection).get();
    return snapshot.docs
      .map((document) => document.data() as NewsletterSubscriber)
      .sort((first, second) => second.subscribedAt.localeCompare(first.subscribedAt));
  }

  return getLocalSubscribers();
}

export async function subscribeToNewsletter(name: string, email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const firestore = getFirebaseFirestore();
  if (firestore) {
    const existingSnapshot = await firestore.collection(subscribersCollection).where("email", "==", normalizedEmail).limit(1).get();
    if (!existingSnapshot.empty) {
      const existing = existingSnapshot.docs[0].data() as NewsletterSubscriber;
      const updated: NewsletterSubscriber = { ...existing, name: name || existing.name, status: "subscribed" };
      await firestore.collection(subscribersCollection).doc(existing.id).set(updated);
      return updated;
    }

    const subscriber: NewsletterSubscriber = {
      id: randomUUID(),
      name,
      email: normalizedEmail,
      subscribedAt: new Date().toISOString(),
      status: "subscribed",
      unsubscribeToken: randomUUID(),
    };
    await firestore.collection(subscribersCollection).doc(subscriber.id).set(subscriber);
    return subscriber;
  }

  const subscribers = await getLocalSubscribers();
  const existingIndex = subscribers.findIndex((subscriber) => subscriber.email === normalizedEmail);
  if (existingIndex !== -1) {
    subscribers[existingIndex] = { ...subscribers[existingIndex], name: name || subscribers[existingIndex].name, status: "subscribed" };
    await writeLocalSubscribers(subscribers);
    return subscribers[existingIndex];
  }

  const subscriber: NewsletterSubscriber = {
    id: randomUUID(),
    name,
    email: normalizedEmail,
    subscribedAt: new Date().toISOString(),
    status: "subscribed",
    unsubscribeToken: randomUUID(),
  };
  subscribers.unshift(subscriber);
  await writeLocalSubscribers(subscribers);
  return subscriber;
}

export async function updateNewsletterSubscriberStatus(id: string, status: NewsletterStatus) {
  const firestore = getFirebaseFirestore();
  if (firestore) {
    await firestore.collection(subscribersCollection).doc(id).update({ status });
    return;
  }

  const subscribers = await getLocalSubscribers();
  const index = subscribers.findIndex((subscriber) => subscriber.id === id);
  if (index === -1) {
    return;
  }

  subscribers[index] = { ...subscribers[index], status };
  await writeLocalSubscribers(subscribers);
}

export async function unsubscribeByToken(token: string) {
  const firestore = getFirebaseFirestore();
  if (firestore) {
    const snapshot = await firestore.collection(subscribersCollection).where("unsubscribeToken", "==", token).limit(1).get();
    if (snapshot.empty) {
      return false;
    }

    await snapshot.docs[0].ref.update({ status: "unsubscribed" satisfies NewsletterStatus });
    return true;
  }

  const subscribers = await getLocalSubscribers();
  const index = subscribers.findIndex((subscriber) => subscriber.unsubscribeToken === token);
  if (index === -1) {
    return false;
  }

  subscribers[index] = { ...subscribers[index], status: "unsubscribed" };
  await writeLocalSubscribers(subscribers);
  return true;
}

export async function deleteNewsletterSubscriber(id: string) {
  const firestore = getFirebaseFirestore();
  if (firestore) {
    await firestore.collection(subscribersCollection).doc(id).delete();
    return;
  }

  const subscribers = await getLocalSubscribers();
  await writeLocalSubscribers(subscribers.filter((subscriber) => subscriber.id !== id));
}

import "server-only";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getFirebaseFirestore } from "@/lib/firebase-admin";

export type StemDaysStatus = "new" | "contacted" | "closed";

export type StemDaysSignupSubmission = {
  id: string;
  submittedAt: string;
  status: StemDaysStatus;
  paid: boolean;
  parentName: string;
  parentEmail: string;
  phone: string;
  childName: string;
  grade: string;
  days: string[];
  notes: string;
};

const submissionsFilePath = path.join(process.cwd(), "data", "stem-days-signups.json");
const submissionsCollection = "stem-days-signups";

async function getLocalSubmissions() {
  try {
    return JSON.parse(await readFile(submissionsFilePath, "utf8")) as StemDaysSignupSubmission[];
  } catch {
    return [];
  }
}

async function writeLocalSubmissions(submissions: StemDaysSignupSubmission[]) {
  await mkdir(path.dirname(submissionsFilePath), { recursive: true });
  await writeFile(submissionsFilePath, JSON.stringify(submissions, null, 2));
}

export async function getStemDaysSignups() {
  const firestore = getFirebaseFirestore();
  if (firestore) {
    const snapshot = await firestore.collection(submissionsCollection).get();
    return snapshot.docs
      .map((document) => document.data() as StemDaysSignupSubmission)
      .sort((first, second) => second.submittedAt.localeCompare(first.submittedAt));
  }

  const submissions = await getLocalSubmissions();
  return [...submissions].sort((first, second) => second.submittedAt.localeCompare(first.submittedAt));
}

export async function saveStemDaysSignup(submission: StemDaysSignupSubmission) {
  const firestore = getFirebaseFirestore();
  if (firestore) {
    await firestore.collection(submissionsCollection).doc(submission.id).set(submission);
    return;
  }

  const submissions = await getLocalSubmissions();
  submissions.unshift(submission);
  await writeLocalSubmissions(submissions);
}

export async function updateStemDaysSignup(id: string, updates: Partial<Pick<StemDaysSignupSubmission, "status" | "paid">>) {
  const firestore = getFirebaseFirestore();
  if (firestore) {
    await firestore.collection(submissionsCollection).doc(id).update(updates);
    return;
  }

  const submissions = await getLocalSubmissions();
  const index = submissions.findIndex((submission) => submission.id === id);
  if (index === -1) {
    return;
  }

  submissions[index] = { ...submissions[index], ...updates };
  await writeLocalSubmissions(submissions);
}

import "server-only";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getFirebaseFirestore } from "@/lib/firebase-admin";

export type OutreachRequestStatus = "new" | "contacted" | "closed";

export type OutreachRequestSubmission = {
  id: string;
  submittedAt: string;
  status: OutreachRequestStatus;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  preferredDates: string;
  requestType: string;
  details: string;
};

const submissionsFilePath = path.join(process.cwd(), "data", "outreach-requests.json");
const submissionsCollection = "outreach-requests";

async function getLocalSubmissions() {
  try {
    return JSON.parse(await readFile(submissionsFilePath, "utf8")) as OutreachRequestSubmission[];
  } catch {
    return [];
  }
}

async function writeLocalSubmissions(submissions: OutreachRequestSubmission[]) {
  await mkdir(path.dirname(submissionsFilePath), { recursive: true });
  await writeFile(submissionsFilePath, JSON.stringify(submissions, null, 2));
}

export async function getOutreachRequests() {
  const firestore = getFirebaseFirestore();
  if (firestore) {
    const snapshot = await firestore.collection(submissionsCollection).get();
    return snapshot.docs
      .map((document) => document.data() as OutreachRequestSubmission)
      .sort((first, second) => second.submittedAt.localeCompare(first.submittedAt));
  }

  const submissions = await getLocalSubmissions();
  return [...submissions].sort((first, second) => second.submittedAt.localeCompare(first.submittedAt));
}

export async function saveOutreachRequest(submission: OutreachRequestSubmission) {
  const firestore = getFirebaseFirestore();
  if (firestore) {
    await firestore.collection(submissionsCollection).doc(submission.id).set(submission);
    return;
  }

  const submissions = await getLocalSubmissions();
  submissions.unshift(submission);
  await writeLocalSubmissions(submissions);
}

export async function updateOutreachRequestStatus(id: string, status: OutreachRequestStatus) {
  const firestore = getFirebaseFirestore();
  if (firestore) {
    await firestore.collection(submissionsCollection).doc(id).update({ status });
    return;
  }

  const submissions = await getLocalSubmissions();
  const index = submissions.findIndex((submission) => submission.id === id);
  if (index === -1) {
    return;
  }

  submissions[index] = { ...submissions[index], status };
  await writeLocalSubmissions(submissions);
}

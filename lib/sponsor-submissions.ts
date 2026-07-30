import "server-only";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getFirebaseFirestore } from "@/lib/firebase-admin";

export type SponsorStatus = "New" | "Completed" | "Discussing" | "Rejected";

export type SponsorSubmission = {
  id: string;
  submittedAt: string;
  status: SponsorStatus;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  mailingAddress: string;
  socialMedia: {
    instagram: string;
    facebook: string;
    linkedin: string;
  };
  sponsorshipTier: string;
  contributionTypes: string[];
  contributionNotes: string;
  logoFile: {
    name: string;
    type: string;
    size: number;
  } | null;
};

const submissionsFilePath = path.join(process.cwd(), "data", "sponsor-intake-submissions.json");
const submissionsCollection = "sponsor-submissions";

async function getLocalSubmissions() {
  try {
    return JSON.parse(await readFile(submissionsFilePath, "utf8")) as SponsorSubmission[];
  } catch {
    return [];
  }
}

export async function getSponsorSubmissions() {
  const firestore = getFirebaseFirestore();
  if (firestore) {
    const snapshot = await firestore.collection(submissionsCollection).get();
    return snapshot.docs
      .map((document) => document.data() as SponsorSubmission)
      .sort((first, second) => second.submittedAt.localeCompare(first.submittedAt));
  }

  return getLocalSubmissions();
}

export async function saveSponsorSubmission(submission: SponsorSubmission) {
  const firestore = getFirebaseFirestore();
  if (firestore) {
    await firestore.collection(submissionsCollection).doc(submission.id).set(submission);
    return;
  }

  const submissions = await getLocalSubmissions();
  submissions.unshift(submission);
  await mkdir(path.dirname(submissionsFilePath), { recursive: true });
  await writeFile(submissionsFilePath, JSON.stringify(submissions, null, 2));
}

export async function updateSponsorSubmissionStatus(id: string, status: SponsorStatus) {
  const firestore = getFirebaseFirestore();
  if (firestore) {
    await firestore.collection(submissionsCollection).doc(id).update({ status });
    return;
  }

  const submissions = await getLocalSubmissions();
  const submissionIndex = submissions.findIndex((submission) => submission.id === id);
  if (submissionIndex === -1) {
    return;
  }

  submissions[submissionIndex] = { ...submissions[submissionIndex], status };
  await mkdir(path.dirname(submissionsFilePath), { recursive: true });
  await writeFile(submissionsFilePath, JSON.stringify(submissions, null, 2));
}

export async function deleteSponsorSubmission(id: string) {
  const firestore = getFirebaseFirestore();
  if (firestore) {
    await firestore.collection(submissionsCollection).doc(id).delete();
    return;
  }

  const submissions = await getLocalSubmissions();
  await mkdir(path.dirname(submissionsFilePath), { recursive: true });
  await writeFile(submissionsFilePath, JSON.stringify(submissions.filter((submission) => submission.id !== id), null, 2));
}

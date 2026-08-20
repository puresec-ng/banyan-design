import { redirect } from 'next/navigation';

export default function LegacySupportEntryPoint() {
  redirect('/request-support');
}

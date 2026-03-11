import { auth } from '@/auth';
import { getUserById } from '@/app/lib/data';
import EditProfileForm from '@/app/ui/profile/edit-form';
import { lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    redirect('/login');
  }

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-2xl`}>Your Profile</h1>
      <EditProfileForm user={{ name: user.name, email: user.email }} />
    </main>
  );
}

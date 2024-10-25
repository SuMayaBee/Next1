// pages/index.tsx
import type { NextPage } from 'next';
import ImageUpload from '../../imageFile';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Image Album</h1>
        <ImageUpload />
      </div>
    </div>
  );
};

export default Home;

import type { NextPage } from 'next';
import ImageGallery from '../../imageRAG';
import ImageUploaderWithGallery from '../../imageUploadWithGallery';


const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Image Album</h1>
        <ImageUploaderWithGallery />
      </div>
    </div>
  );
};

export default Home;

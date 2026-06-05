'use client';

import { useParams } from 'next/navigation';

export default function Author() {
  const params = useParams();
  const name = params.name as string;

  const formatName = (n: string) => {
    const words = n.split('-');
    return words.map((word) => word[0].toUpperCase() + word.substring(1)).join(' ');
  };

  return (
    <>
      <h1>{formatName(name)}&apos;s Articles</h1>
      <ul>
        <li><a href="#">Sample Article</a></li>
      </ul>
    </>
  );
}

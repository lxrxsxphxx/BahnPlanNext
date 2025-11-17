import { useState } from "react";
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold mt-4">Home Page Content</h1>
      <p>Hier kommt der restliche Inhalt deiner Homepage.</p>
    </div>
  );
}


import { Bike } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <Link to="/" className="flex items-center space-x-3">
          <Bike className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold">台灣單車賽事</h1>
            <p className="text-blue-100 text-sm">Taiwan Cycling Events</p>
          </div>
        </Link>
      </div>
    </header>
  );
}

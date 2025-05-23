
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbProps {
  items: Array<{label: string, path: string}>;
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4 px-4">
      {items.map((item, index) => (
        <div key={item.path} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />}
          {index === 0 ? (
            <Link 
              to={item.path} 
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              <Home className="h-4 w-4 mr-1" />
              {item.label}
            </Link>
          ) : index === items.length - 1 ? (
            <span className="text-gray-900 font-medium">{item.label}</span>
          ) : (
            <Link 
              to={item.path} 
              className="hover:text-blue-600 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

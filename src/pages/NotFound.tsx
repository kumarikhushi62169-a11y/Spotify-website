import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Disc3 } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="mb-8 text-[var(--brand-color)]"
      >
        <Disc3 className="h-32 w-32" />
      </motion.div>
      <h1 className="mb-4 text-5xl font-bold tracking-tighter">404</h1>
      <h2 className="mb-8 text-2xl font-semibold tracking-tight text-[var(--text-secondary)]">Page not found</h2>
      <p className="mb-8 max-w-md text-[var(--text-secondary)]">
        We can't seem to find the page you are looking for. It might have been removed or the link might be broken.
      </p>
      <Link 
        to="/" 
        className="rounded-full bg-[var(--text-primary)] px-8 py-3 font-bold text-[var(--bg-main)] hover:scale-105 transition-transform"
      >
        Go Back Home
      </Link>
    </div>
  );
}

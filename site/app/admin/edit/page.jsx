import { Suspense } from 'react';
import AdminEdit from '../../../src/views/AdminEdit.jsx';

const fallback = <div className="admin-page" style={{ minHeight: '100vh' }} />;

export default function AdminEditPage() {
  return <Suspense fallback={fallback}><AdminEdit /></Suspense>;
}

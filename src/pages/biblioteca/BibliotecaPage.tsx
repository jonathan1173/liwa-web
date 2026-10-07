import React, { useState, useEffect, useMemo } from 'react';
import { LibraryBook } from '@/types';
import { getLibraryBooks } from '@/lib/supabase';
import {
  BookOpen,
  Download,
  ExternalLink,
  Search,
  RefreshCw,
  X,
  FileText,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

export const BibliotecaPage: React.FC = () => {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<LibraryBook | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLibraryBooks();
      setBooks(data);
    } catch (err: any) {
      console.error('Error fetching library books:', err);
      setError('No se pudieron cargar los libros de la biblioteca. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;
    const query = searchQuery.toLowerCase().trim();
    return books.filter((b) => b.title_book.toLowerCase().includes(query));
  }, [books, searchQuery]);

  const handleImageError = (id: number) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const handleCopyDownloadLink = (url: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-10 mb-8 sm:mb-12 overflow-hidden border border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-xs">
        <div
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #4A198C 0%, #EC006C 100%)' }}
        />
        <div
          className="absolute -left-16 -bottom-16 w-60 h-60 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7AAF00 0%, transparent 70%)' }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4A198C]/10 border border-[#4A198C]/20 text-[#4A198C] text-xs font-bold mb-3 shadow-2xs">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Biblioteca Digital Liwa</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#EC006C]" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#2C2C2C] tracking-tight mb-2">
              Lecturas y Libros de la Comunidad
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Explora y descarga material educativo, libros y guías digitales disponibles para todos.
              Aprende, comparte y fomenta el conocimiento libre.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-slate-50/90 border border-slate-200/80 text-center flex items-center justify-center gap-2">
              <span className="text-2xl font-black text-[#4A198C]">{books.length}</span>
              <span className="text-xs font-semibold text-slate-500">
                {books.length === 1 ? 'Libro disponible' : 'Libros disponibles'}
              </span>
            </div>
            <button
              onClick={fetchBooks}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white border border-slate-200/90 hover:bg-slate-50 text-xs font-bold text-[#2C2C2C] transition-all cursor-pointer shadow-2xs hover:scale-[1.02] disabled:opacity-50"
              title="Actualizar biblioteca"
            >
              <RefreshCw className={`w-4 h-4 text-[#4A198C] ${loading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative z-10 mt-6 sm:mt-8 pt-6 border-t border-slate-100">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar libros por título..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white/95 border border-slate-200/90 text-sm text-[#2C2C2C] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4A198C]/30 focus:border-[#4A198C] transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                title="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="mb-8 p-6 rounded-3xl bg-rose-50/80 border border-rose-200 text-center">
          <p className="text-sm font-semibold text-rose-800 mb-3">{error}</p>
          <button
            onClick={fetchBooks}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-3xl bg-white border border-slate-200/70 p-4 flex flex-col gap-4 animate-pulse shadow-xs"
            >
              <div className="aspect-[3/4] w-full rounded-2xl bg-slate-100 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-slate-200" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
                <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
              </div>
              <div className="h-10 bg-slate-100 rounded-xl mt-auto" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredBooks.length === 0 && (
        <div className="text-center py-16 px-4 bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-[#4A198C]/10 flex items-center justify-center mx-auto mb-4 text-[#4A198C]">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#2C2C2C] mb-1">
            {searchQuery ? 'Sin resultados para tu búsqueda' : 'Aún no hay libros cargados'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-5">
            {searchQuery
              ? `No encontramos ningún libro que coincida con "${searchQuery}". Prueba con otro título.`
              : 'La biblioteca se está actualizando. Vuelve a consultar pronto para ver las nuevas lecturas.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
            >
              Ver todos los libros
            </button>
          )}
        </div>
      )}

      {/* Book Grid */}
      {!loading && !error && filteredBooks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => {
            const hasCover = !!book.url_image && !imageErrors[book.id];
            const hasDownload = !!book.url_download;

            return (
              <div
                key={book.id}
                className="group rounded-3xl bg-white border border-slate-200/80 p-4 flex flex-col justify-between hover:border-[#4A198C]/30 hover:shadow-xl hover:shadow-[#4A198C]/5 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Book Cover Area */}
                <div
                  className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-[#4A198C]/15 via-slate-50 to-[#EC006C]/10 flex items-center justify-center cursor-pointer border border-slate-100 shadow-inner group/cover"
                  onClick={() => setSelectedBook(book)}
                >
                  {hasCover ? (
                    <img
                      src={book.url_image || ''}
                      alt={book.title_book}
                      className="w-full h-full object-cover group-hover/cover:scale-105 transition-transform duration-500"
                      onError={() => handleImageError(book.id)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full p-6 flex flex-col justify-between text-center items-center bg-gradient-to-br from-[#4A198C] via-[#371369] to-[#EC006C] text-white">
                      <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="my-auto px-2">
                        <p className="text-sm font-extrabold line-clamp-3 text-white drop-shadow-sm">
                          {book.title_book}
                        </p>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white/90">
                        Liwa Digital
                      </span>
                    </div>
                  )}

                  {/* Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-white/90 backdrop-blur-md text-[#2C2C2C] shadow-xs border border-white/40 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-[#4A198C]" />
                      Digital
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-2xs">
                    <span className="px-3 py-1.5 rounded-xl bg-white text-[#2C2C2C] text-xs font-bold shadow-lg flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#4A198C]" />
                      Ver detalles
                    </span>
                  </div>
                </div>

                {/* Book Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => setSelectedBook(book)}
                      className="text-base font-bold text-[#2C2C2C] line-clamp-2 hover:text-[#4A198C] transition-colors cursor-pointer mb-2"
                      title={book.title_book}
                    >
                      {book.title_book}
                    </h3>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 mt-2 border-t border-slate-100 flex items-center gap-2">
                    {hasDownload ? (
                      <a
                        href={book.url_download || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold bg-[#4A198C] hover:bg-[#3d1474] text-white transition-all shadow-xs hover:shadow-md hover:shadow-[#4A198C]/20 cursor-pointer"
                        title="Descargar o abrir libro"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => setSelectedBook(book)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-100 text-slate-500 cursor-pointer hover:bg-slate-200 transition"
                      >
                        <span>Detalles</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedBook(book)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-[#4A198C] hover:bg-slate-50 transition cursor-pointer"
                      title="Ver información ampliada"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Book Detail Modal */}
      {selectedBook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedBook(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 p-2 rounded-2xl text-slate-400 hover:text-[#2C2C2C] hover:bg-slate-100 transition cursor-pointer"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start pt-2">
              {/* Cover Preview in Modal */}
              <div className="w-36 sm:w-44 aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md flex-shrink-0 flex items-center justify-center">
                {selectedBook.url_image && !imageErrors[selectedBook.id] ? (
                  <img
                    src={selectedBook.url_image}
                    alt={selectedBook.title_book}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(selectedBook.id)}
                  />
                ) : (
                  <div className="w-full h-full p-4 flex flex-col justify-between text-center items-center bg-gradient-to-br from-[#4A198C] via-[#371369] to-[#EC006C] text-white">
                    <BookOpen className="w-8 h-8 text-white mt-4" />
                    <p className="text-xs font-bold line-clamp-3">{selectedBook.title_book}</p>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20">
                      Liwa
                    </span>
                  </div>
                )}
              </div>

              {/* Info Details */}
              <div className="flex-1 flex flex-col justify-between text-center sm:text-left">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#4A198C]/10 text-[#4A198C] text-[11px] font-bold mb-2">
                    <Sparkles className="w-3 h-3" />
                    <span>Libro Comunitario</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#2C2C2C] leading-snug mb-3">
                    {selectedBook.title_book}
                  </h2>
                  <p className="text-xs text-slate-500 mb-4">
                    Formato digital para lectura y consulta libre en la comunidad Liwa.
                  </p>
                </div>

                {/* Actions inside modal */}
                <div className="space-y-2.5 pt-2">
                  {selectedBook.url_download ? (
                    <>
                      <a
                        href={selectedBook.url_download}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-[#4A198C] hover:bg-[#3d1474] text-white transition-all shadow-md shadow-[#4A198C]/25 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Abrir o Descargar Libro</span>
                      </a>

                      <button
                        onClick={() => handleCopyDownloadLink(selectedBook.url_download || '')}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                      >
                        {copiedLink ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#7AAF00]" />
                            <span className="text-[#7AAF00]">¡Enlace copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar enlace de descarga</span>
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
                      El enlace de descarga aún no está configurado para este título.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BibliotecaPage;

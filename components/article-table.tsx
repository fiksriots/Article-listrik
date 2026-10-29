import type {ComponentPropsWithoutRef} from 'react';

export function ArticleTable({children,...props}:ComponentPropsWithoutRef<'table'>){
  return <div className="article-table-block"><div className="article-table-scroll" role="region" aria-label="Tabel materi, dapat digeser ke samping" tabIndex={0}><table {...props}>{children}</table></div><p className="article-table-hint">Geser tabel ke samping untuk melihat semua kolom →</p></div>;
}

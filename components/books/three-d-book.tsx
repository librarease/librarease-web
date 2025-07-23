import { Book } from '@/lib/types/book'
import clsx from 'clsx'
import Image from 'next/image'

export const ThreeDBook: React.FC<{
  book: Pick<Book, 'title' | 'author' | 'cover' | 'year'>
}> = ({ book }) => {
  return (
    // container
    <div className="[perspective:3000px] group">
      {/* book */}
      <div
        className={clsx(
          'w-56 h-80 mx-auto my-[5%] transform-3d transition-transform duration-500',
          '[transform:rotate3d(0,1,0,35deg)] lg:[transform:none] lg:group-hover:[transform:rotate3d(0,1,0,35deg)]'
        )}
      >
        {/* front */}
        <div
          className={clsx(
            'absolute transform-3d [transform-origin:0%_50%] [transform:translate3d(0,0,20px)]',
            "after:content-[''] after:bg-accent after:absolute after:top-0 after:bottom-0 after:-left-[1px] after:w-1"
          )}
        >
          {/* cover */}
          <Image
            src={book.cover ?? '/book-placeholder.svg'}
            width={224}
            height={360}
            alt={`${book.author} - ${book.year} cover`}
            className={clsx(
              'w-56 h-80 rounded-r-lg shadow-xl'
              // "after:content-[''] after:absolute after:top-0 after:left-2.5 after:bottom-0 after:w-1 after:bg-rose-500"
            )}
          />
        </div>
        {/* left-side */}
        <div className="bg-accent absolute w-10 -left-5 h-80 [transform:rotate3D(0,1,0,-90deg)]">
          <h2 className="text-sm w-80 h-56 pr-2.5 pt-2 text-right [transform-origin:0%_0%] [transform:rotate(90deg)_translateY(-40px)]">
            <span className="pr-3">{book.author}</span>
            <span>{book.year}</span>
          </h2>
        </div>
      </div>
    </div>
  )
}

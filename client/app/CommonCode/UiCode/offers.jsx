'use client';

export default function Offers({offerMsg}) {

  return (
    <div className="p-2 my-0.5 shadow-md bg-red-900">
      {/* offers */}
      <p className='text-orange-200'>
        {offerMsg}
      </p>
      
    </div>
  );
}

interface Props {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onPageSelect: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onPageSelect,
}: Props) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-end mt-4 items-center gap-2">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded-md hover:bg-blue-500 hover:text-white disabled:opacity-50"
      >
        &lt;
      </button>

      {[...Array(totalPages)].map((_, idx) => (
        <button
          key={idx}
          onClick={() => onPageSelect(idx + 1)}
          className={`px-3 py-1 border rounded-md ${
            currentPage === idx + 1
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-100"
          }`}
        >
          {idx + 1}
        </button>
      ))}

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded-md hover:bg-blue-500 hover:text-white disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;

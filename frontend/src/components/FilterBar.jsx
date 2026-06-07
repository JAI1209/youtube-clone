const FilterBar = ({ activeFilter, onFilterChange }) => {
  const filters = [
    'All',
    'Web Development',
    'JavaScript',
    'React',
    'Node.js',
    'Python',
    'Data Structures',
    'Music',
    'Gaming',
    'News'
  ];

  return (
    <div className="flex gap-3 py-3 overflow-x-auto scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors duration-200 ${
            activeFilter === filter
              ? 'bg-white text-black font-semibold'
              : 'bg-[#272727] text-white hover:bg-[#3f3f3f]'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
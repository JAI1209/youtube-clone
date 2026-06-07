const filters = [
  'All', 'Web Development', 'JavaScript', 'React',
  'Node.js', 'Python', 'Data Structures', 'Music', 'Gaming', 'News',
];

const FilterBar = ({ activeFilter, onFilterChange }) => (
  <div className="yt-filter-bar">
    {filters.map((f) => (
      <button
        key={f}
        className={`yt-filter-btn ${activeFilter === f ? 'active' : 'inactive'}`}
        onClick={() => onFilterChange(f)}
      >
        {f}
      </button>
    ))}
  </div>
);

export default FilterBar;

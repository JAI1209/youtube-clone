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
    <div style={styles.container}>
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          style={{
            ...styles.filterBtn,
            ...(activeFilter === filter ? styles.activeBtn : {})
          }}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '12px',
    padding: '12px 0',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  filterBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    background: '#272727',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'background 0.2s',
  },
  activeBtn: {
    background: '#fff',
    color: '#000',
  },
};

export default FilterBar;
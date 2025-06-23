const SelectivityModal = ({ modalInfo, comment, setComment, onCancel, onSubmit }) => {
  if (!modalInfo) return null;

  return (
    <div style={{ /* same styling */ }}>
      <div style={{ /* modal box */ }}>
        <h3>{modalInfo.action === 'add' ? 'Add Client' : 'Update Status'}</h3>
        <textarea value={comment} onChange={e => setComment(e.target.value)} />
        <div>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onSubmit}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default SelectivityModal;

import { useState, type FormEvent } from 'react';
import Modal from './Modal';

type Props = {
  existingNames: string[];
  onAdd: (name: string) => void;
  onClose: () => void;
};

export default function MemberForm({ existingNames, onAdd, onClose }: Props) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('名前を入力してください');
      return;
    }
    if (existingNames.includes(trimmed)) {
      setError('同じ名前のメンバーが登録されています');
      return;
    }
    onAdd(trimmed);
    onClose();
  };

  return (
    <Modal title="メンバーを追加" onClose={onClose}>
      <form onSubmit={handleSubmit} className="member-form">
        <label htmlFor="member-name-input">名前</label>
        <input
          id="member-name-input"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          placeholder="例：山田 太郎"
          autoFocus
        />
        {error && <p className="form-error">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            キャンセル
          </button>
          <button type="submit" className="btn btn-primary">
            追加
          </button>
        </div>
      </form>
    </Modal>
  );
}

import { useState } from 'react';

import { Modal, type ModalProps } from './modal';

export function SignupModal(props: Omit<ModalProps, 'children'>) {
  // Two-way-binding states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');

  return (
    <Modal {...props}>
      <div className="text-black">
        <h2 className="mb-4 text-xl font-bold">Registrierung</h2>
        <form className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name*"
            className="rounded border p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email*"
            className="rounded border p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Passwort*"
            className="rounded border p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Passwort wiederholen*"
            className="rounded border p-2"
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
            required
          />
        </form>
      </div>
    </Modal>
  );
}

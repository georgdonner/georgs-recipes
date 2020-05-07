import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './NoList.scss';

const NoList = ({ onUpdate }) => {
  const [code, setCode] = useState('');

  const updateCode = () => {
    onUpdate(code);
  };

  return (
    <div id="nolist-wrapper">
      <div id="nolist">
        <label htmlFor="code">
          Um die Einkaufsliste nutzen zu können, gib hier bitte einen Code ein.
          Dieser Code wird verwendet, um deine Einkaufsliste eindeutig zu identifizieren,
          daher such dir am besten einen einzigartigen und ausgefallenen Code aus.
          <br />
          Falls du die gleiche Liste auf einem anderen Gerät verwenden
          oder mit jemandem zusammen benutzen möchtest, einfach dort den gleichen Code eingeben
          und die Liste synchronisiert sich automatisch!
        </label>
        <input
          type="text" name="code" placeholder="Einkaufslisten Code"
          value={code} className="input"
          onChange={({ target }) => setCode(target.value)}
        />
        <button className="button inverted" type="button" onClick={updateCode}>
          Bestätigen
        </button>
      </div>
    </div>
  );
};

NoList.propTypes = {
  onUpdate: PropTypes.func.isRequired,
};

export default NoList;
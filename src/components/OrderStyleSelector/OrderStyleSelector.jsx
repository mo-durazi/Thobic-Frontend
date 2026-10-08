import {
  getStyleOptionLabel,
  STYLE_FIELDS,
  STYLE_OPTIONS,
  STYLE_OPTION_IMAGES,
} from '../../lib/styleOptions';

import './OrderStyleSelector.css';

const OrderStyleSelector = ({ value, onChange, className = '' }) => (
  <section className={`order-style-selector ${className}`.trim()}>
    <h2 className="order-style-selector-title">Choose your thawb style</h2>

    {STYLE_FIELDS.map(({ name, label }) => {
      const groupId = `style-options-${name}`;

      return (
        <fieldset className="order-style-group" key={name}>
          <legend className="order-style-group-title" id={groupId}>{label}</legend>
          <div className="order-style-options" role="radiogroup" aria-labelledby={groupId}>
            {STYLE_OPTIONS[name].map((option) => {
              const image = STYLE_OPTION_IMAGES[name]?.[option];
              const showImageArea = name !== 'sidePockect';
              const selected = value[name] === option;

              return (
                <label
                  className={`order-style-option${selected ? ' selected' : ''}`}
                  key={option}
                >
                  <input
                    className="order-style-option-input"
                    type="radio"
                    name={`order-style-${name}`}
                    value={option}
                    checked={selected}
                    onChange={() => onChange(name, option)}
                  />
                  <span className={`order-style-option-card${showImageArea ? '' : ' text-only'}`}>
                    {showImageArea && (
                      <span className="order-style-option-image">
                        {image ? (
                          <img src={image} alt="" loading="lazy" />
                        ) : (
                          <span className="order-style-option-image-placeholder" aria-hidden="true">
                            Photo coming soon
                          </span>
                        )}
                      </span>
                    )}
                    <span className="order-style-option-label">
                      {getStyleOptionLabel(name, option)}
                    </span>
                    <span className="order-style-option-check" aria-hidden="true">
                      {selected ? 'Selected' : 'Choose'}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      );
    })}
  </section>
);

export default OrderStyleSelector;

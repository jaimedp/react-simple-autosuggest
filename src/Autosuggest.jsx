import React from 'react';
import PropTypes from 'prop-types';

const Key = {
  UP: 38,
  DOWN: 40,
  ENTER: 13,
  ESCAPE: 27
};

export default class Autosuggest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      show: false,
      selected: -1
    };
  }

  handleKeyDown(e) {
    if (e.metaKey) {
      return;
    }
    const key = e.which;

    // const handleNormalKey = () => {
      //   if (/[^a-zA-Z0-9_-\s\w\.\b\x08]/.test(String.fromCharCode(key))) {
        //     return;
        //   }
        //   const val = e.target.value + String.fromCharCode(key);
        //   let items = [];
        //   if (val) {
          //     if (typeof this.props.options === 'function') {
            //       items = this.props.options(val);
            //     } else {
              //       const re = new RegExp(val, 'i');
              //       items = this.props.options.filter((s) => {
                //         return re.test(s);
                //       });
                //     }
                //   }

                //   this.setState({
                  //     items: items.slice(0, this.props.maxItems),
                  //     show: !!items.length
                  //   });
                  // };
    const selected = this.state.selected;

    switch (key) {
      case Key.UP:
        e.preventDefault();
        this.setState({ selected: Math.max(0, selected - 1) });
        break;
      case Key.DOWN:
        e.preventDefault();
        this.setState({ selected: Math.min(this.state.items.length - 1, selected + 1) });
        break;
      case Key.LEFT:
        break;
      case Key.RIGHT:
        break;
      case Key.ESCAPE:
        this.setState({ show: false, selected: -1 });
        break;
      case Key.ENTER:
        this.commitOption(selected);
        e.preventDefault();
        break;
      default:
        // handleNormalKey();
        break;
    }
  }

  _computeSuggestions(e) {
    const handleNormalKey = () => {
      const val = e.target.value;
      let items = [];
      const escapeVal = (v) => { return v.replace(/[()?*.]/g, (x) => { return `\\${x}`; }); };
      const re = new RegExp(escapeVal(val).split(' ').join('.*?'), 'i');
      if (val) {
        if (typeof this.props.options === 'function') {
          items = this.props.options(val);
        } else {
          items = this.props.options.filter((s) => {
            return re.test(s);
          });
        }
      }

      this.setState({
        items: items.slice(0, this.props.maxItems),
        show: !!items.length,
        pattern: re
      });
    };

    handleNormalKey();
  }

  handleChange(e) {
    const val = e.target.value;
    this._computeSuggestions(e);
    this.setState({ value: val });
    this.props.onChange(e, val);
  }

  handleBlur(e) {
    this.setState({ show: false });
    this.props.onBlur(e);
  }

  commitOption(index) {
    if (index >= 0) {
      const val = this.state.items[index];
      this.setState({ value: val, show: false });
      this.props.onChange({ target: { value: val } });
    }
  }

  selectOption(index) {
    this.setState({ selected: index });
  }

  render() {
    const suggestions = this.state.items.map((el, index) => {
      const className = this.state.selected === index ? 'selected' : '';
      const text = el.replace(this.state.pattern, (m) => { return `<em>${m}</em>`; });

      // TODO: Refactor this to not use dangerouslySetInnerHTML as it can be a XSS vulnerability
      return (
        <li
          data-value={el}
          key={index}
          className={className}
          onMouseDown={this.commitOption.bind(this, index)}
          onMouseOver={() => { this.selectOption(index); }}
          onMouseOut={() => { this.selectOption(-1); }}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      );
    });

    return (
      <span className="autosuggest">
        <input
          type="text"
          placeholder={this.props.placeholder} {...this.props.inputProps}
          onKeyDown={this.handleKeyDown.bind(this)}
          value={this.props.value}
          onChange={this.handleChange.bind(this)}
          onBlur={this.handleBlur.bind(this)}
          className={this.props.className}
        /> {
          this.state.show &&
          <ul className="autosuggest-list" > { suggestions } </ul>
        }
      </span>
    );
  }
}

Autosuggest.propTypes = {
  inputProps: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  maxItems: PropTypes.number,
  value: PropTypes.any,
  options: PropTypes.oneOfType([PropTypes.func, PropTypes.array])
};

Autosuggest.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  maxItems: 10,
  options: []
};

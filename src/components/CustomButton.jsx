import { Button } from 'pixel-retroui';

function CustomButton({onclick, text, className = null, classText = null}) {
  return (
    <Button onClick={onclick} className={`${className} hover:!bg-[#ddceb4] hover:!scale-105`}
        bg="#ddceb4"
        textColor="#30210b"
        borderColor="#30210b"
        shadow="#30210b">
      <span className={`${classText}`}>{text}</span>
    </Button>
  );
}

export default CustomButton
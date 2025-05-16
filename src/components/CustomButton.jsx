import { Button } from 'pixel-retroui';

function CustomButton({onclick, text, className = null, classText = null, icon = null}) {
  return (
    <Button 
      onClick={onclick}
      className={`${className} hover:!bg-[#ddceb4] hover:!scale-105 hover:shadow-lg transition-all duration-300`}
      bg="#ddceb4"
      textColor="#30210b"
      borderColor="#30210b"
      shadow="#30210b"
    >
      <div className="flex items-center justify-center gap-2">
        {icon && <span className="mr-1">{icon}</span>}
        <span className={`${classText}`}>{text}</span>
      </div>
    </Button>
  );
}

export default CustomButton
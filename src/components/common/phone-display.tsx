interface PhoneDisplayProps {
  phone: string;
}

const formatPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return digits.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1 $2 $3");
};

const PhoneDisplay = ({ phone }: PhoneDisplayProps) => {
  const digitsOnly = phone.replace(/\D/g, "");

  return (
    <a href={`tel:${digitsOnly}`} className="  hover:underline">
      {formatPhone(phone)}
    </a>
  );
};

export default PhoneDisplay;

type SpeedDialPropType = {
  setDisplayAddModal: (value: React.SetStateAction<boolean>) => void;
  displayAddModal: boolean;
};

const SpeedDial = ({
  setDisplayAddModal,
  displayAddModal,
}: SpeedDialPropType) => {
  return (
    <button
      onClick={() => setDisplayAddModal(true)}
      type="button"
      id="speed-dial"
      className="fixed right-[20px] bottom-4 md:bottom-5 md:right-[100px] lg:bottom-5 lg:right-[100px] bg-moderateBlue rounded-full w-14 h-14 hover:bg-blue-800 active:bg-blue-800 active:ring-1 ring-blue-500 ring-offset-2"
    >
      <i className="pi pi-plus text-white"></i>
    </button>
  );
};

export default SpeedDial;

const HolidayBanner = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-primary text-primary-foreground py-2 md:py-3 px-4 text-center">
      <p className="text-xs md:text-base font-medium leading-tight">
        <span className="font-bold">Holiday Break:</span> <span className="hidden sm:inline">We are taking a short break over the holidays and our office will reopen on 12 January. We appreciate your continued support and look forward to assisting you in the new year.</span>
        <span className="sm:hidden">Office reopens 12 January.</span>
      </p>
    </div>
  );
};

export default HolidayBanner;

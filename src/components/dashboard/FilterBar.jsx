
import { Input } from "../ui/input";

const FilterBar = ({ onSearch, onCategoryChange, onSubscribedChange }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <Input
        placeholder="Search for a course..."
        onChange={(e) => onSearch(e.target.value)}
        className="flex-grow"
      />
      <select 
        onChange={(e) => onCategoryChange(e.target.value)}
        className="h-12 w-full md:w-auto rounded-md border-2 border-neutral bg-base-100 px-4 py-3 text-lg font-semibold text-base-content ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-[4px_4px_0px_#1A1A1A] focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all duration-200"
      >
        <option value="">All Categories</option>
        <option value="Development">Development</option>
        <option value="Design">Design</option>
        <option value="Marketing">Marketing</option>
      </select>
      <select 
        onChange={(e) => onSubscribedChange(e.target.value)}
        className="h-12 w-full md:w-auto rounded-md border-2 border-neutral bg-base-100 px-4 py-3 text-lg font-semibold text-base-content ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-[4px_4px_0px_#1A1A1A] focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all duration-200"
      >
        <option value="all">All Courses</option>
        <option value="subscribed">Subscribed</option>
      </select>
    </div>
  );
};

export default FilterBar;

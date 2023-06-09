import { useState, useContext } from "react";
// import { useEffect } from "react";
import AdoptedPetContext from "./AdoptedPetContext";
import { useQuery } from "@tanstack/react-query";
import fetchSearch from "./fetchSearch";
import useBreedList from "./useBreedList";
import Result from "./Results";

const ANIMALS = ["bird", "cat", "dog"];

const SearchParams = () => {


  //uncontrolled forms- form data is handled by DOM instead by React component
  const [requestParams, setRequestParams] = useState({
    location: "",
    animal: "",
    breed: "",
  });

  // const [location, setLocation] = useState("");
  const [animal, setAnimal] = useState("");
  // const [pets, setPets] = useState([]);
  // const [breed, setBreed] = useState("");
  const [breeds] = useBreedList(animal);


  //go do something else ouside from hook lifecycle
  // useEffect(() => {
  //   requestPets();
  // },[]); // eslint-disable-line react-hooks/exhaustive-deps
  //workflow is render with no useEffect, than run useEffect once

  // async function requestPets(){
  //   const res = await fetch(`http://pets-v2.dev-apis.com/pets?animal=${animal}&location=${location}&breed=${breed}`);
  //   const json = await res.json();

  //   setPets(json.pets);

  // }

  const [adoptedPet,_] = useContext(AdoptedPetContext);

  const results = useQuery(["search", requestParams], fetchSearch);
  const pets = results?.data?.pets ?? [];

  return (
    <div className="my-0 mx-auto w-11/12">
      <form className="p-10 mb-10 rounded-lg bg-gray-200 shadow-lg flex flex-col justify-center items-center"
        onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const obj = {
          animal: formData.get("animal") ?? "",
          breed: formData.get("breed") ?? "",
          location: formData.get("location") ?? "",
        };
        setRequestParams(obj);
        // requestPets();
      }}>
            {
                 adoptedPet ? (
                <div className="pet image-container">
                  <img src={adoptedPet.images[0]} alt={adoptedPet.name} />
                </div>
              ) : null // you have to remove this semi-colon, my auto-formatter adds it back if I delete it
            }
        <label htmlFor="location">Location
        <input
          type="text"
          name="location"
          className="search-input" 
          // onChange={(e) => setLocation(e.target.value)}
          id="location"
          placeholder="Location"
          // value={location}
        /></label>
        <label htmlFor="animal">
          Animal
          <select
            id="animal"
            className="search-input" 
            value={animal}
            onChange={(e) => {
              setAnimal(e.target.value);
              // setBreed("");
            }}
            // onBlur={(e) => {
            //     setAnimal(e.target.value);
            //     setBreed("");
            //   }}
          
     
          >
            <option />
            {ANIMALS.map((animal) => (
              <option key={animal} value={animal}>
                {animal}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="breed">
            Breed
            <select
                id="breed"
                className="search-input grayed-out-disabled" 
                // value={breed}
                name="breed"
                disabled={breeds.length === 0}
                // onChange={(e) => {
                //     setBreed(e.target.value)
                // }}
                // onBlur={(e) => setBreed(e.target.value)}
            >
               <option/>
              {breeds.map((breed) => (
                <option key={breed} value={breed}>{breed}</option>
              ))}
               
            </select>

        </label>
        <button className="rounded px-6 py-2 text-white hover:opacity-50 border-none bg-orange-500">
          Submit
        </button>
      </form>
      {
       <Result pets ={pets}/>
      }
    </div>
  );
};
export default SearchParams;

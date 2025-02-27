import { Button } from "../Components/Inputs/Button"
import { CheckBox } from "../Components/Inputs/CheckBox"
import { Input } from "../Components/Inputs/Input"
import { useState } from "react"
import { CloseIcon } from "../Icons/CloseIcon"
import axios from "axios"
import { BACKEND_URL } from "../config"
import { useParams } from "react-router-dom"

enum MedTime {
    AfterMeal = "aftermeal",
    BeforeMeal = "beforemeal"
}

export const CreatePrescription = ({ open, setOpen  }: { open: boolean, setOpen: (value: boolean) => void }) => {
    const [time, setTime] = useState(MedTime.AfterMeal);
    const prescriptionId = useParams().prescriptionId;

    const [medicine, setMedication] = useState("");
    const [Dose, setDose] = useState("");
    const [DoseUnit, setDoseUnit] = useState("mg");
    const [Duration, setDuration] = useState("");
    const [DurationUnit, setDurationUnit] = useState("Day");
    const [Morning, setMorning] = useState(false);
    const [Afternoon, setAfternoon] = useState(false);
    const [Evening, setEvening] = useState(false);
    
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const validateInputs = () => {
        const newErrors: {[key: string]: string} = {};
        if (!medicine.trim()) newErrors.medicine = "Medication name is required.";
        if (!Dose.trim()) newErrors.Dose = "Dose is required.";
        if (!Duration.trim()) newErrors.Duration = "Duration is required.";
        if (!Morning && !Afternoon && !Evening) newErrors.Frequency = "At least one time slot must be selected.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const medicationData = async () => {
        if (!validateInputs()) return;
        if (!prescriptionId) {
            console.error("Error: Prescription ID is missing!");
            return;
        }
        
        try {
            await axios.post(`${BACKEND_URL}cms/v1/doctor/medication`, {
                prescriptionId: prescriptionId,
                medication: medicine,
                dose: Dose,
                doseUnit: DoseUnit,
                duration: Duration,
                durationUnit: DurationUnit,
                morning: Morning,
                afternoon: Afternoon,
                evening: Evening,
                mealStatus: time
            });
            setOpen(false);
            window.dispatchEvent(new Event("medicineUpdated"));
        } catch (error) {
            console.error("Error adding medication:", error);
        }
    };

    return (
        <div>
            {open && (
                <div className="min-h-screen min-w-screen fixed inset-0 flex justify-center items-center z-50">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="bg-white w-[90%] lg:max-w-[1000px] md:min-w-[800px] h-auto p-7 relative rounded-2xl shadow-lg">
                        <div className="absolute right-1 top-1 text-[#3B9AB8]" onClick={() => setOpen(false)} >
                            <CloseIcon size={28.5} />
                        </div>

                        <div className="space-y-4">
                            <div className="grid  lg:grid-cols-3 md:grid-cols-2">
                                <div className="flex-1">
                                    <Input placeholder="Medication" size="large" type="text" onChange={(e) => setMedication(e.target.value)} />
                                    {errors.medicine && <p className="text-red-500 text-sm">{errors.medicine}</p>}
                                </div>
                                <div className="w-1/4 md:w-auto flex items-center">
                                    <Input placeholder="Dose" size="small" type="number" onChange={(e) => setDose(e.target.value)} />
                                    <select onChange={(e) => setDoseUnit(e.target.value)} name="MedicineUnit" id="medicineUnit" className='h-[40px] shadow-md w-32 mx-2 rounded-md p-1 focus:outline-none'>
                                        <option value="mg">mg</option>
                                        <option value="g">g</option>
                                        <option value="mcg">mcg</option>
                                        <option value="kg">kg</option>
                                        <option value="mL">mL</option>
                                        <option value="L">L</option>
                                        <option value="cc">cc</option>
                                        <option value="drop">drop (gtt)</option>
                                        <option value="IU">IU</option>
                                    </select>
                                    {errors.Dose && <p className="text-red-500 text-sm">{errors.Dose}</p>}
                                </div>
                                <div className="w-1/4 md:w-auto flex items-center">
                                    <Input placeholder="Duration" size="small" type="number" onChange={(e) => setDuration(e.target.value)} />
                                    <select onChange={(e) => setDurationUnit(e.target.value)} name="DurationUnit" id="durationunit" className='h-[40px] shadow-md w-32 mx-2 rounded-md p-1 focus:outline-none'>
                                        <option value="day">Day</option>
                                        <option value="days">Days</option>
                                        <option value="month">Month</option>
                                        <option value="months">Months</option>
                                    </select>
                                    {errors.Duration && <p className="text-red-500 text-sm">{errors.Duration}</p>}
                                </div>
                            </div>
                            <div className="p-3 shadow-md rounded-2xl">
                                <div className="font-semibold">Frequency</div>
                                <div className="flex flex-wrap gap-3">
                                    <CheckBox onChange={(e) => setMorning(e.target.checked)} name="Morning" title="Morning" id="morning" />
                                    <CheckBox onChange={(e) => setAfternoon(e.target.checked)} name="Afternoon" title="Afternoon" id="afternoon" />
                                    <CheckBox onChange={(e) => setEvening(e.target.checked)} name="Evening" title="Evening" id="evening" />
                                </div>
                                {errors.Frequency && <p className="text-red-500 text-sm mt-2">{errors.Frequency}</p>}
                            </div>
                            <div className="flex flex-col md:flex-row justify-center md:justify-end items-center gap-3">
                                <Button
                                    onClick={() => setTime(MedTime.BeforeMeal)}
                                    title="Before Meal"
                                    size="md"
                                    variant={time === MedTime.BeforeMeal ? "primary" : "secondary"}
                                />
                                <Button
                                    onClick={() => setTime(MedTime.AfterMeal)}
                                    title="After Meal"
                                    size="md"
                                    variant={time === MedTime.AfterMeal ? "primary" : "secondary"}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center mt-5">
                            {Object.keys(errors).length > 0 && <p className="text-red-500 text-sm mb-2">Please fix the errors above.</p>}
                            <Button title="Add Medication" variant="primary" size="md" onClick={medicationData} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
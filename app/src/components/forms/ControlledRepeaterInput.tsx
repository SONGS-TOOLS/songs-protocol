import { Body2, Body3, TextInput } from "@gordo-d/mufi-ui-components";
import { ArrayPath, Control, Controller, FieldValues, useFieldArray } from "react-hook-form";
import cx from "classnames";
import { ControlledRepeaterInputProps } from "./types";

//TYPES NEED FIXING. EVERYTHING RELATED TO REPEATER FIELDS.

const ControlledRepeaterInput = <T extends FieldValues>({
	control,
	errors,
	rules,
	inputName,
	inputLabel,
	subfields,
	// field,
	required = false,
}: ControlledRepeaterInputProps<T>) => {
	const { fields, append, prepend, remove, swap, move, insert } = useFieldArray<T>({
		control, // control props comes from useForm (optional: if you are using FormProvider)
		name: inputName as ArrayPath<T>, // unique name for your Field Array
	});
	const emptyObject = subfields.map((el) => el.name).reduce((a, v) => ({ ...a, [v]: "" }), {});
	return (
		<>
			{inputLabel && (
				<Body2 color="neutral-600">
					{inputLabel}
					{required && <span className="text-semantic-error"> *</span>}
				</Body2>
			)}
			<div
				className={cx(
					"border-neutral-300",
					"rounded-base block w-full border-2 p-3 outline-none transition-all",
					"bg-white text-neutral-800",
					"flex flex-col gap-4",
				)}
			>
				{fields.map((item, index) => {
					return (
						<div key={item.id} className="flex gap-4">
							{subfields.map((subField) => {
								return (
									<Controller
										key={subField.name}
										control={control}
										name={`${inputName}.${index}.${subField.name}`}
										rules={subField.rules}
										render={({ field }) => {
											const errorMessage = errors[inputName]?.[index]?.[subField.name]?.message;
											return (
												<div className="flex-1">
													<TextInput
														label={subField.label}
														className={cx({ "border-semantic-error": errorMessage })}
														required={required}
														{...field}
														// value={item[subField.name]}
														// value=""
														value={field.value.value || field.value}
													/>
													{errorMessage && (
														<Body3 color="semantic-error">{errorMessage as React.ReactNode}</Body3>
													)}
												</div>
											);
										}}
									/>
								);
							})}
							<div className="flex flex-col gap-2">
								<Body2>&nbsp;</Body2>
								<div className="flex flex-1 flex-col justify-center">
									<Body2
										onClick={() => remove(index)}
										color="neutral-600"
										className="cursor-pointer underline"
									>
										Remove
									</Body2>
								</div>
							</div>
						</div>
					);
				})}
				<Body2
					color="neutral-600"
					className="cursor-pointer pt-4 underline"
					onClick={() => {
						append({ ...emptyObject });
					}}
				>
					{" "}
					Add {inputLabel}
				</Body2>
			</div>
		</>
	);
	// return (
	// <Controller
	// 	name={inputName}
	// 	control={control}
	// 	rules={rules}
	// 	render={({ field }) => {
	// 		return (
	// 			<div>
	// 				<TextInput
	// 					label={inputLabel}
	// 					className={cx({ "border-semantic-error": errors[inputName] })}
	// 					required={required}
	// 					{...field}
	// 					// value=""
	// 				/>
	// 				{errors[inputName] && (
	// 					<Body3 color="semantic-error">{errors[inputName].message as React.ReactNode}</Body3>
	// 				)}
	// 			</div>
	// 		);
	// 	}}
	// />
	// );
};
export default ControlledRepeaterInput;

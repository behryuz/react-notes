import { useEffect, useReducer } from 'react';
import Button from '../Button/Button';
import styles from './JournalForm.module.css';
import cn from 'classnames';
import { INITIAL_STATE, formReducer } from './JournalFormState';
import { useRef } from 'react';
import Input from '../Input/Input';


function JournalForm({ onSubmit }) {

	const [formState, dispatchForm] = useReducer(formReducer, INITIAL_STATE);
	const { isValid, isFormReadyToSubmit, values } = formState;
	const titleRef = useRef();
	const dateRef = useRef();
	const textRef = useRef();

	const focusError = (isValid) => {
		switch(true) {
		case !isValid.title: 
			titleRef.current.focus();
			break;
		case !isValid.date: 
			dateRef.current.focus();
			break;
		case !isValid.text: 
			textRef.current.focus();
			break;
		}
	};

	useEffect(() => {
		let timerId;
		if (!isValid.title || !isValid.date || !isValid.text) {
			focusError(isValid);
			timerId = setTimeout(() => {
				dispatchForm({ type: 'RESET_VALIDITY'});
			}, 2000);
		}
		return () => {
			clearTimeout(timerId);
		};
	}, [isValid]);

	useEffect(() => {
		if (isFormReadyToSubmit) {
			onSubmit(values);
			dispatchForm({type: 'CLEAR'});
		}
	}, [isFormReadyToSubmit, values, onSubmit]);

	const addJournalItem = (e) => {
		e.preventDefault();
		dispatchForm({type: 'SUBMIT'});
	};

	const onChange = (e) => {
		dispatchForm({ type: 'SET_VALUE', payload: { [e.target.name]: e.target.value }});
	};
	
	return (
		<form className={styles['journal-form']} onSubmit={addJournalItem}>
			<div>
				<Input type='text' ref={titleRef} onChange={onChange} value={values.title} name='title' isValid={!isValid.title}/>
			</div>
			<div className={styles['form-row']}>
				<label htmlFor="date" className={styles['form-label']}>
					<img src='/calendar.svg' alt='Иконка календаря'/>
					<span>Дата</span>
				</label>
				<Input type='date' ref={dateRef} onChange={onChange} name='date' value={values.date} id="date" isValid={!isValid.title}/>

			</div>
			<div className={styles['form-row']}>
				<label htmlFor="tag" className={styles['form-label']}>
					<img src='/folder.svg' alt='Иконка папки'/>
					<span>Метки</span>
				</label>
				<Input type='text' onChange={onChange} id="tag" value={values.tag} name='tag' />
			</div>

			<textarea name="text" ref={textRef} onChange={onChange}  id="" cols="30" rows="10" value={values.text} className={cn(styles['input'], {
				[styles['invalid']]: !isValid.text
			})}></textarea>
			<Button text="Сохранить" />
		</form>
	);
}

export default JournalForm;
import {useEffect,useRef,type ReactNode} from 'react';
import {X} from 'lucide-react';
export default function Modal({title,children,onClose,wide=false}:{title:string;children:ReactNode;onClose:()=>void;wide?:boolean}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const d=ref.current;d?.showModal();return()=>d?.close();},[]);
 return <dialog ref={ref} className={'nbs-modal '+(wide?'wide':'')} onCancel={onClose} onClick={e=>{if(e.target===ref.current)onClose()}}><div className="modal-heading"><h2>{title}</h2><button aria-label="Close dialog" onClick={onClose}><X size={21}/></button></div>{children}</dialog>
}
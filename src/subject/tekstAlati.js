export const napraviPredmete = (pred) => {
    let subject = [...pred];
    if(subject.length === 0){
        return "Anonymous";
    }else if(subject.length === 1){
        return subject[0];
    }else{
        let last = subject.pop();
        console.log(last);
        let r = subject.join(", ");
        return r + " & " + last;
    }
}

export const lc_match = (x, q) => {
    return x.toLowerCase().includes(q.toLowerCase());
}

export const prvo_veliko = (s) => {
    return s.substring(0, 1).toUpperCase() + s.substring(1);
}
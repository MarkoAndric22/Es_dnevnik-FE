export const napraviNastavnike = (nast) => {
    let teacher = [...nast];
    if(teacher.length === 0){
        return "Anonymous";
    }else if(teacher.length === 1){
        return teacher[0];
    }else{
        let last = teacher.pop();
        console.log(last);
        let r = teacher.join(", ");
        return r + " & " + last;
    }
}

export const lc_match = (x, q) => {
    return x.toLowerCase().includes(q.toLowerCase());
}

export const prvo_veliko = (s) => {
    return s.substring(0, 1).toUpperCase() + s.substring(1);
}